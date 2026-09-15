"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { uploadTenderDocument } from "@/lib/actions/admin/tenders"
import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DOCUMENT_TYPES = [
  { value: "tender_document", label: "Tender Document" },
  { value: "addendum", label: "Addendum" },
  { value: "opening_result", label: "Opening Result" },
  { value: "award_notice", label: "Award Notice" },
]

const initialState: ActionResult | null = null

export function TenderDocumentUploadForm({ tenderId }: { tenderId: string }) {
  const [state, formAction, pending] = useActionState(uploadTenderDocument, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Document uploaded.")
      formRef.current?.reset()
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <input type="hidden" name="tenderId" value={tenderId} />
      <div className="min-w-40 flex-1 space-y-1.5">
        <Label htmlFor="doc-title">Title</Label>
        <Input id="doc-title" name="title" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="doc-type">Type</Label>
        <select
          id="doc-type"
          name="documentType"
          defaultValue="tender_document"
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {DOCUMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="doc-file">File</Label>
        <Input id="doc-file" name="file" type="file" required className="w-56" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="doc-order">Order</Label>
        <Input
          id="doc-order"
          name="sortOrder"
          type="number"
          min={0}
          max={999}
          defaultValue={0}
          className="w-20"
        />
      </div>
      {/* Marking a document returnable is what turns the pack into a checklist:
          it becomes a named upload slot for the supplier and a tick, or a gap,
          on their bid. */}
      <label className="flex items-center gap-2 pb-2 text-sm">
        <input
          type="checkbox"
          name="isRequiredReturn"
          value="true"
          className="size-4 rounded border-input"
        />
        <span>
          Must be signed &amp; returned
          <span className="text-muted-foreground block text-xs">
            Appears as a required upload on every bid
          </span>
        </span>
      </label>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Uploading..." : "Upload"}
      </Button>
    </form>
  )
}
