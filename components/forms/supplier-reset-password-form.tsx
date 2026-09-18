"use client"

import { useActionState } from "react"
import Link from "next/link"

import { setNewPassword, type AuthResult } from "@/lib/actions/auth"
import { PasswordField } from "@/components/admin/password-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const initialState: AuthResult | null = null

export function SupplierResetPasswordForm() {
  const [state, formAction, pending] = useActionState(setNewPassword, initialState)

  if (state?.success) {
    return (
      <div className="space-y-4 text-sm">
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
          Your password has been changed, and you are signed in.
        </p>
        <Link href="/suppliers/dashboard" className="font-medium underline underline-offset-4">
          Go to your dashboard
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <PasswordField id="password" name="password" required offerGenerator />
        <p className="text-xs text-muted-foreground">At least 10 characters.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordField id="confirmPassword" name="confirmPassword" required />
      </div>

      {state && !state.success ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Set new password"}
      </Button>
    </form>
  )
}
