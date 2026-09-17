"use client"

import { useActionState } from "react"
import Link from "next/link"

import { requestPasswordReset, type AuthResult } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthResult | null = null

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState)

  if (state?.success) {
    return (
      <div className="space-y-4 text-sm">
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
          If that address has an account, a link to set a new password is on its way. It expires shortly, so use it
          when it arrives.
        </p>
        <p className="text-muted-foreground">
          Nothing after a few minutes? Check the spam folder, then ask another administrator to set a password for you
          from Admin → Staff.
        </p>
        <Link href="/admin/login" className="font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      {state && !state.success ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "Email me a link"}
      </Button>

      <Link
        href="/admin/login"
        className="block text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Back to sign in
      </Link>
    </form>
  )
}
