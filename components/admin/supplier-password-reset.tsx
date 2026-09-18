"use client"

import { useActionState, useEffect, useState } from "react"
import { KeyRound } from "lucide-react"
import { toast } from "sonner"

import { resetSupplierPassword } from "@/lib/actions/admin/suppliers"
import { PasswordField } from "@/components/admin/password-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { ActionResult } from "@/lib/actions/forms"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const initialState: ActionResult | null = null

/**
 * Sets a supplier's password on their behalf.
 *
 * The supplier's own "Forgot your password?" link is the normal route. This is
 * the fallback for when the email never arrives -- procurement reads the new
 * password down the phone and the supplier changes it afterwards. It also
 * confirms their email address, since an unconfirmed one blocks sign-in just
 * as firmly as a forgotten password and looks identical from outside.
 */
export function SupplierPasswordReset({ supplierId, companyName }: { supplierId: string; companyName: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(resetSupplierPassword, initialState)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success(`New password set for ${companyName}. Give it to them directly, and ask them to change it.`)
      // Closing the dialog is the response to the action having succeeded, and
      // the action result only arrives here. Same pattern as appointment-form.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false)
    } else {
      toast.error(state.error)
    }
  }, [state, companyName])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyRound className="size-3.5" aria-hidden="true" /> Reset password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password for {companyName}</DialogTitle>
          <DialogDescription>
            Use this only when the supplier cannot receive the reset email. Give them the new password directly and
            ask them to change it once they are in.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="supplierId" value={supplierId} />
          <div className="space-y-1.5">
            <Label htmlFor={`password-${supplierId}`}>New password</Label>
            <PasswordField id={`password-${supplierId}`} name="password" required offerGenerator />
            <p className="text-xs text-muted-foreground">At least 10 characters.</p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Setting..." : "Set password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
