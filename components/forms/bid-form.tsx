"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { submitBid } from "@/lib/actions/suppliers"
import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: ActionResult | null = null

export function BidForm({ tenderId, tenderTitle }: { tenderId: string; tenderTitle: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(submitBid, initialState)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Bid submitted.")
      // Closes the dialog after a successful submit; the action result only
      // arrives via this effect, so there is no event handler to do it from.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false)
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Submit Bid</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Bid</DialogTitle>
          <DialogDescription>{tenderTitle}</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="tenderId" value={tenderId} />

          <div className="space-y-1.5">
            <Label htmlFor="bidAmount">Bid amount (KES, optional)</Label>
            <Input id="bidAmount" name="bidAmount" type="number" min={0} step="0.01" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="documents">Bid documents</Label>
            <Input id="documents" name="documents" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting..." : "Submit Bid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
