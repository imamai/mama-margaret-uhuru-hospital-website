"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, FileText, X } from "lucide-react"
import { toast } from "sonner"

import { updateBidScores, updateBidStatus } from "@/lib/actions/admin/bids"
import type { ActionResult } from "@/lib/actions/forms"
import { StatusSelect } from "@/components/admin/status-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"

const BID_STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "under_evaluation", label: "Under evaluation" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "awarded", label: "Awarded" },
] as const

const scoresInitialState: ActionResult | null = null

export function BidRow({
  id,
  tenderId,
  supplierName,
  bidAmount,
  technicalScore,
  financialScore,
  status,
  documents,
  checklist = [],
}: {
  id: string
  tenderId: string
  supplierName: string
  bidAmount: number | null
  technicalScore: number | null
  financialScore: number | null
  status: string
  documents: { title: string; signedUrl: string | null }[]
  /** The forms this tender requires back, and whether each one arrived. */
  checklist?: { title: string; returned: boolean }[]
}) {
  const [state, formAction, pending] = useActionState(updateBidScores, scoresInitialState)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Scores saved.")
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{supplierName}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {bidAmount ? `KES ${Number(bidAmount).toLocaleString()}` : "--"}
      </TableCell>
      <TableCell>
        {/* Eligibility at a glance. The hospital's own rules disqualify a bid
            missing any required form, so whether it is complete matters more
            than what the files happen to be called. */}
        {checklist.length > 0 && (
          <div className="mb-2 space-y-0.5">
            {(() => {
              const missing = checklist.filter((c) => !c.returned)
              return missing.length === 0 ? (
                <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <Check className="size-3.5" aria-hidden="true" />
                  All {checklist.length} required forms returned
                </p>
              ) : (
                <div className="text-xs">
                  <p className="text-destructive flex items-center gap-1 font-medium">
                    <X className="size-3.5" aria-hidden="true" />
                    {missing.length} of {checklist.length} required forms missing
                  </p>
                  <ul className="text-muted-foreground mt-0.5 list-disc pl-4">
                    {missing.map((c) => (
                      <li key={c.title}>{c.title}</li>
                    ))}
                  </ul>
                </div>
              )
            })()}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {documents.map((doc, i) =>
            doc.signedUrl ? (
              <a
                key={i}
                href={doc.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-brand-deep hover:underline dark:text-brand-accent"
              >
                <FileText className="size-3.5" aria-hidden="true" />
                {doc.title}
              </a>
            ) : null
          )}
        </div>
      </TableCell>
      <TableCell>
        <form action={formAction} className="flex items-center gap-1.5">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="tenderId" value={tenderId} />
          <Input name="technicalScore" type="number" min={0} max={100} defaultValue={technicalScore ?? ""} placeholder="Tech" className="w-16" />
          <Input name="financialScore" type="number" min={0} max={100} defaultValue={financialScore ?? ""} placeholder="Fin" className="w-16" />
          <Button type="submit" size="sm" variant="outline" disabled={pending}>
            Save
          </Button>
        </form>
      </TableCell>
      <TableCell className="text-right">
        <StatusSelect
          value={status as (typeof BID_STATUS_OPTIONS)[number]["value"]}
          options={BID_STATUS_OPTIONS as unknown as { value: string; label: string }[]}
          onChange={(next) => updateBidStatus(id, next as (typeof BID_STATUS_OPTIONS)[number]["value"], tenderId)}
        />
      </TableCell>
    </TableRow>
  )
}
