"use server"

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

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
