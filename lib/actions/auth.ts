"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient, findUserIdByEmail } from "@/lib/supabase/admin"
import { canSendEmail, passwordResetEmail, sendEmail } from "@/lib/email"

export type AuthResult = { success: true } | { success: false; error: string }

const signInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
})

export async function signIn(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid credentials." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { success: false, error: "Incorrect email or password." }
  }

  redirect((formData.get("next") as string) || "/admin")
}

/**
 * The address the recovery email should send people back to.
 *
 * Taken from the request rather than a setting, so it is right in development,
 * on a preview deployment and in production without anyone remembering to
 * change it. Supabase will only honour addresses on its own redirect
 * allow-list, so a forged Host header cannot send the link somewhere else.
 */
export async function siteOrigin(): Promise<string> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

/**
 * Which sign-in the reset belongs to.
 *
 * Staff and suppliers use the same Supabase project but land in different
 * parts of the site, so the emailed link has to come back to the right
 * callback. This is a closed set rather than a path taken from the form --
 * a caller-supplied redirect is how an open-redirect gets shipped.
 */
const CALLBACKS = {
  admin: "/admin/auth/callback",
  supplier: "/suppliers/auth/callback",
} as const

export type ResetScope = keyof typeof CALLBACKS

/**
 * Recent reset requests, per address.
 *
 * In memory, so it resets on deploy and is per-instance -- which would be weak
 * protection on its own. It is not on its own: a link is only ever generated
 * for an address that already belongs to this hospital (see
 * `belongsToHospital`), so the set of addresses anyone can trigger mail to is
 * small, known, and not attacker-chosen. This just stops the same person
 * hammering the button.
 */
const recentRequests = new Map<string, number[]>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_PER_WINDOW = 3

function rateLimited(email: string): boolean {
  const now = Date.now()
  const seen = (recentRequests.get(email) ?? []).filter((t) => now - t < WINDOW_MS)
  if (seen.length >= MAX_PER_WINDOW) {
    recentRequests.set(email, seen)
    return true
  }
  seen.push(now)
  recentRequests.set(email, seen)
  return false
}

/**
 * Is this address one of ours?
 *
 * This Supabase project is shared with seven unrelated sites, so `auth.users`
 * holds their people too. Without this check, anyone could type a jemvoyage or
 * kida user's address into the hospital's reset form and that person would
 * receive a password-reset email branded Mama Margaret Uhuru Hospital -- for an
 * account that has nothing to do with the hospital. That is a cross-tenant
 * leak and a convincing phishing template in one.
 *
 * A supplier is one with a row in margaret_suppliers. A staff member is one
 * holding a role in margaret_user_roles. Anyone else is not ours to email.
 */
async function belongsToHospital(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  email: string,
  scope: ResetScope,
): Promise<boolean> {
  if (scope === "supplier") {
    const { data } = await admin
      .from("margaret_suppliers")
      .select("id")
      .eq("email", email)
      .is("deleted_at", null)
      .maybeSingle()
    return Boolean(data)
  }

  const userId = await findUserIdByEmail(email)
  if (!userId) return false

  const { data } = await admin.from("margaret_user_roles").select("id").eq("user_id", userId).limit(1)
  return Boolean(data?.length)
}

/**
 * Sends the "set a new password" email, as the hospital.
 *
 * Supabase's own resetPasswordForEmail is not used, for two reasons.
 *
 * The sender: SMTP settings belong to the whole Supabase project, and seven
 * other sites share it. Pointing it at the hospital would make all of them
 * send as the hospital. Sending from here keeps that to this site alone.
 *
 * The link: Supabase's link returns its tokens in a URL *fragment*, which a
 * browser never sends to the server, so the callback route could not read them
 * and every reset died on "link expired". Building the link here puts the
 * token in the query string instead, which is the form the callback already
 * verifies with verifyOtp.
 *
 * It reports success whether or not the address has an account. Saying "no
 * such user" would let anyone with the sign-in page discover who works here --
 * or which companies supply the hospital -- and both are worth more than that
 * to an attacker.
 */
export async function requestPasswordReset(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const parsed = z.string().trim().email("Please enter a valid email address.").safeParse(formData.get("email"))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email." }

  const raw = String(formData.get("scope") ?? "admin")
  const scope: ResetScope = raw === "supplier" ? "supplier" : "admin"
  const email = parsed.data.toLowerCase()

  // The same answer in almost every branch below, so nothing about the account
  // can be inferred from what comes back.
  const indistinguishable: AuthResult = { success: true }

  // A misconfigured site is not a secret, and silence here would leave nobody
  // able to tell a broken deployment from an unknown address.
  if (!canSendEmail()) {
    return {
      success: false,
      error: "Password reset email isn't configured on this site yet. Please contact the hospital directly.",
    }
  }

  if (rateLimited(email)) {
    return { success: false, error: "Too many requests. Please wait a few minutes and try again." }
  }

  const admin = createAdminClient()
  if (!admin) return indistinguishable

  if (!(await belongsToHospital(admin, email, scope))) return indistinguishable

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${await siteOrigin()}${CALLBACKS[scope]}` },
  })

  const tokenHash = data?.properties?.hashed_token
  if (error || !tokenHash) return indistinguishable

  const link = `${await siteOrigin()}${CALLBACKS[scope]}?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`
  const message = passwordResetEmail({ link, audience: scope === "supplier" ? "supplier" : "staff" })

  const result = await sendEmail({ to: email, ...message })
  if (!result.sent) {
    // Worth knowing about in the logs; still not worth telling the browser,
    // which would reveal that the address exists.
    console.error(`Password reset email failed for a ${scope} account:`, result.reason)
  }

  return indistinguishable
}

const newPasswordSchema = z
  .object({
    password: z.string().min(10, "Your new password must be at least 10 characters."),
    confirmPassword: z.string().min(1, "Type your new password again."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "The passwords don't match.",
    path: ["confirmPassword"],
  })

/**
 * Sets the new password, for someone who arrived through the emailed link.
 *
 * The link is what authorises this: following it exchanges a one-time code for
 * a session, so by the time this runs there is a signed-in user to update. No
 * session means the link was never followed, or has expired.
 */
export async function setNewPassword(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const parsed = newPasswordSchema.safeParse({
    password: formData.get("password") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: "This link has expired. Ask for a new one from the sign-in page.",
    }
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) return { success: false, error: error.message }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
