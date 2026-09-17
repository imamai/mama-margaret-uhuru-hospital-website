"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { toast } from "sonner"

import { uploadLibraryDocument } from "@/lib/actions/admin/document-library"
import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CATEGORIES = [
  { value: "rfq_form", label: "RFQ form" },
  { value: "contract", label: "Contract" },
  { value: "policy", label: "Policy" },
  { value: "template", label: "Template" },
  { value: "other", label: "Other" },
]

const initialState: ActionResult | null = null

export function LibraryUploadForm() {
  const [state, formAction, pending] = useActionState(uploadLibraryDocument, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Added to the library.")
      formRef.current?.reset()
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <form ref={formRef} action={formAction} className="rounded-xl border p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Upload className="size-4" aria-hidden="true" />
        Add a document from this computer
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1 space-y-1.5">
          <Label htmlFor="lib-title">Title</Label>
          <Input id="lib-title" name="title" required placeholder="e.g. Form SD2 — no corrupt practice" />
        </div>

        <div className="min-w-48 flex-1 space-y-1.5">
          <Label htmlFor="lib-description">Description (optional)</Label>
          <Input id="lib-description" name="description" placeholder="When this one is used" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lib-category">Category</Label>
          <select
            id="lib-category"
            name="category"
            defaultValue="rfq_form"
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lib-file">File</Label>
          <Input id="lib-file" name="file" type="file" accept=".pdf,.doc,.docx" required className="w-56" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lib-order">Order</Label>
          <Input id="lib-order" name="sortOrder" type="number" min={0} max={999} defaultValue={0} className="w-20" />
        </div>

        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Uploading..." : "Add to library"}
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        One combined PDF of the whole pack is fine — so is a separate file per form. Up to 20MB.
      </p>
    </form>
  )
}
