"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { supplierSignIn } from "@/lib/actions/suppliers"
import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: ActionResult | null = null

export function SupplierLoginForm() {
  const [state, formAction, pending] = useActionState(supplierSignIn, initialState)

  useEffect(() => {
    if (state && !state.success) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
