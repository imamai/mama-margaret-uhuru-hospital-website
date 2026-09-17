"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { changeMyPassword } from "@/lib/actions/admin/account"
import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Your password has been changed.")
      formRef.current?.reset()
    } else {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="max-w-sm space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required />
        <p className="text-xs text-muted-foreground">At least 10 characters.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Changing..." : "Change password"}
      </Button>
    </form>
  )
}
