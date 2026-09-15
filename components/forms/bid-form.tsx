"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"
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

export interface BidSlot {
  id: string
  title: string
  fileUrl: string
}

/**
 * Submitting a bid, one named form at a time.
 *
 * A public RFQ asks for specific documents — a Form of Quotation, a Price
 * Schedule, SD1, SD2 — each signed and stamped, and its own rules disqualify a
 * bid that is missing any of them. A single "attach files" box cannot express
 * that: the supplier does not know what is wanted, and the desk receiving six
 * files called scan1.pdf cannot tell what arrived.
 *
 * So each required form is its own row: download the blank, sign and stamp it,
 * upload that one back. The slot names the file, not the supplier's scanner.
 */
export function BidForm({
  tenderId,
  tenderTitle,
  slots = [],
}: {
  tenderId: string
  tenderTitle: string
  slots?: BidSlot[]
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(submitBid, initialState)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      // A bid can be saved and still be incomplete. Saying so plainly, and
      // leaving the dialog open, is more use than a green tick.
      if (state.warning) {
        toast.warning(state.warning, { duration: 12000 })
      } else {
        toast.success("Bid submitted.")
      }
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
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

          {slots.length > 0 && (
            <div className="space-y-3 rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Required forms</p>
                <p className="text-muted-foreground text-xs">
                  Download each one, complete it, sign and stamp it, then upload the
                  scan back here. A bid missing any of these can be rejected at
                  preliminary examination.
                </p>
              </div>

              {slots.map((slot) => (
                <div key={slot.id} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label htmlFor={`slot_${slot.id}`} className="text-sm">
                      {slot.title}
                    </Label>
                    <a
                      href={slot.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
                    >
                      <Download className="size-3" aria-hidden="true" />
                      Download blank
                    </a>
                  </div>
                  <Input
                    id={`slot_${slot.id}`}
                    name={`slot_${slot.id}`}
                    type="file"
                    accept=".pdf,.doc,.docx,image/jpeg,image/png"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="documents">
              {slots.length > 0 ? "Anything else (optional)" : "Bid documents"}
            </Label>
            <Input
              id="documents"
              name="documents"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
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
