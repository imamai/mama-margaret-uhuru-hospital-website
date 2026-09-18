"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { changeMyPassword } from "@/lib/actions/account"
import type { ActionResult } from "@/lib/actions/forms"
import { PasswordField } from "@/components/admin/password-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const initialState: ActionResult | null = null

/**
 * A supplier changing their own password from the dashboard.
 *
 * Same action as the staff form: it verifies the current password before
 * changing anything, so an unattended browser is not enough to take the
 * account over. Procurement can also set a password directly when a supplier
 * is locked out, and this is where that supplier replaces it with one only
 * they know.
 *
 * The fields are remounted on success rather than reset, because they keep
 * their own reveal/generate state -- a plain reset would leave the new
 * password sitting on screen in a shared office.
 */
export function SupplierChangePassword() {
  const [state, formAction, pending] = useActionState(changeMyPassword, initialState)
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Your password has been changed.")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormKey((k) => k + 1)
    } else {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form key={formKey} action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <PasswordField id="currentPassword" name="currentPassword" autoComplete="current-password" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <PasswordField id="newPassword" name="newPassword" autoComplete="new-password" required offerGenerator />
          <p className="text-xs text-muted-foreground">At least 10 characters.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <PasswordField id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Changing..." : "Change password"}
      </Button>
    </form>
  )
}
