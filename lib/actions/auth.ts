"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

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
 * Sends the "set a new password" email.
 *
 * It reports success whether or not the address has an account. Saying "no
 * such user" would let anyone with the sign-in page discover who works here --
 * or which companies supply the hospital -- and both are worth more than that
 * to an attacker.
 */
export async function requestPasswordReset(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const email = z.string().trim().email("Please enter a valid email address.").safeParse(formData.get("email"))
  if (!email.success) return { success: false, error: email.error.issues[0]?.message ?? "Invalid email." }

  const raw = String(formData.get("scope") ?? "admin")
  const scope: ResetScope = raw === "supplier" ? "supplier" : "admin"

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${await siteOrigin()}${CALLBACKS[scope]}`,
  })

  // Rate limiting is worth passing on -- it tells someone to wait rather than
  // to keep pressing a button that appears to work.
  if (error && error.status === 429) return { success: false, error: error.message }

  return { success: true }
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
