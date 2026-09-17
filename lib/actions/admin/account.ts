"use server"

import { createClient as createPlainClient } from "@supabase/supabase-js"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

/**
 * Changing your own password.
 *
 * Supabase will change a password for anyone holding a live session without
 * asking for the old one, which means an unattended, unlocked browser is
 * enough to take an account over. So the current password is verified first.
 *
 * It is verified on a throwaway client that stores nothing: signing in on the
 * cookie-bound server client would issue a new session mid-request and write
 * it over the one the person is using. This one proves the password and is
 * discarded; the real client then makes the change.
 */

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(10, "Your new password must be at least 10 characters."),
    confirmPassword: z.string().min(1, "Type your new password again."),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "The new passwords don't match.",
    path: ["confirmPassword"],
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: "Your new password must be different from your current one.",
    path: ["newPassword"],
  })

export async function changeMyPassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = schema.safeParse({
    currentPassword: formData.get("currentPassword") ?? "",
    newPassword: formData.get("newPassword") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return { success: false, error: "You are not signed in." }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return { success: false, error: "We couldn't verify your current password." }

  const verifier = createPlainClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error: wrongPassword } = await verifier.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  })
  if (wrongPassword) return { success: false, error: "Your current password is not correct." }

  // Sign the throwaway session out again rather than leaving it live until it
  // expires on its own.
  await verifier.auth.signOut()

  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword })
  if (error) return { success: false, error: "We couldn't change your password. Try again." }

  return { success: true }
}
