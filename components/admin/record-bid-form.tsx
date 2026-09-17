"use client"

import { FilePlus } from "lucide-react"

import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Button } from "@/components/ui/button"
import { recordBid } from "@/lib/actions/admin/bids"

/**
 * Records a quotation read out at the public opening.
 *
 * Suppliers no longer submit through the site, so this is how the envelope's
 * contents reach the evaluation: pick the company, enter the quoted figure,
 * and the scoring and award steps carry on as before.
 */
export function RecordBidForm({
  tenderId,
  suppliers,
}: {
  tenderId: string
  suppliers: { id: string; name: string }[]
}) {
  const fields: EntityFieldConfig[] = [
    {
      name: "supplierId",
      label: "Supplier",
      type: "select",
      required: true,
      options: [{ value: "", label: "Choose a registered supplier" }, ...suppliers.map((s) => ({ value: s.id, label: s.name }))],
      hint:
        suppliers.length === 0
          ? "No approved suppliers yet. Approve one under Admin → Suppliers first."
          : "Only approved suppliers appear here.",
    },
    {
      name: "bidAmount",
      label: "Quoted amount (KES)",
      type: "number",
      required: true,
      hint: "As read out at the opening, inclusive of VAT.",
    },
    {
      name: "notes",
      label: "Notes (optional)",
      type: "textarea",
      hint: "Anything noted at the opening — missing forms, late arrival, conditions attached.",
    },
  ]

  return (
    <EntityFormDialog
      trigger={
        <Button size="sm" disabled={suppliers.length === 0}>
          <FilePlus className="size-4" aria-hidden="true" /> Record a quotation
        </Button>
      }
      title="Record a quotation"
      description="Enter what arrived in the envelope, after the public opening."
      fields={fields}
      action={recordBid}
      hiddenFields={{ tenderId }}
    />
  )
}
