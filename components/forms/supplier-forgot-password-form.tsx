"use client"

import { useActionState } from "react"
import Link from "next/link"

import { requestPasswordReset, type AuthResult } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthResult | null = null

export function SupplierForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState)

  if (state?.success) {
    return (
      <div className="space-y-4 text-sm">
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
          If that address is registered, a link to set a new password is on its way. It expires shortly, so use it
          when it arrives.
        </p>
        <p className="text-muted-foreground">
          Nothing after a few minutes? Check your spam folder. If it still hasn&apos;t arrived, contact the
          procurement office and they can reset it for you.
        </p>
        <Link href="/suppliers/login" className="font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Decides which callback the emailed link returns to. Not a path -- the
          action maps this to a fixed URL, so it cannot become a redirect. */}
      <input type="hidden" name="scope" value="supplier" />

      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <p className="text-xs text-muted-foreground">The address you registered with.</p>
      </div>

      {state && !state.success ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "Email me a link"}
      </Button>

      <Link
        href="/suppliers/login"
        className="block text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Back to sign in
      </Link>
    </form>
  )
}
