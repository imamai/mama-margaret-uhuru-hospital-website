"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { changeMyPassword } from "@/lib/actions/admin/account"
import type { ActionResult } from "@/lib/actions/forms"
import { PasswordField } from "@/components/admin/password-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const initialState: ActionResult | null = null

/**
 * Current password, new password, and the new one again.
 *
 * The form clears itself on success, so a shared office machine is not left
 * showing the password that was just set.
 */
export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changeMyPassword, initialState)
  // Bumped on success to remount the fields. The boxes hold their own state so
  // they can be revealed and generated, and a plain form.reset() would leave
  // that state — and the password — sitting on screen.
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Your password has been changed.")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormKey((key) => key + 1)
    } else {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form key={formKey} action={formAction} className="max-w-sm space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <PasswordField id="currentPassword" name="currentPassword" autoComplete="current-password" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordField id="newPassword" name="newPassword" required offerGenerator />
        <p className="text-xs text-muted-foreground">
          At least 10 characters. Generate one if you like — copy it somewhere safe before saving.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordField id="confirmPassword" name="confirmPassword" required />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Changing..." : "Change password"}
      </Button>
    </form>
  )
}
