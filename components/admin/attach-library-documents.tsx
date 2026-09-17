"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Library } from "lucide-react"
import { toast } from "sonner"

import { attachLibraryDocuments } from "@/lib/actions/admin/document-library"
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

export type LibraryChoice = {
  id: string
  title: string
  description: string | null
  category: string
  attached: boolean
}

const initialState: ActionResult | null = null

/**
 * Picks documents off the library shelf and attaches them to this tender.
 *
 * Select all is the common case — the standard pack goes out with nearly every
 * RFQ — so it is one click, with the individual ticks there for the tender
 * that needs something different. Anything already attached is shown ticked
 * and disabled, so it is obvious what this tender already carries.
 */
export function AttachLibraryDocuments({
  tenderId,
  documents,
}: {
  tenderId: string
  documents: LibraryChoice[]
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    attachLibraryDocuments,
    initialState
  )
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const available = documents.filter((doc) => !doc.attached)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success(state.warning ?? "Documents attached to this tender.")
      // Closes the dialog after a successful attach; the action result only
      // arrives via this effect, so there is no event handler to do it from.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false)
      setChecked({})
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, router])

  function setAll(value: boolean) {
    setChecked(Object.fromEntries(available.map((doc) => [doc.id, value])))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Library className="size-4" aria-hidden="true" /> Attach from library
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Attach documents to this tender</DialogTitle>
          <DialogDescription>
            Suppliers will be able to download whatever you attach here.
          </DialogDescription>
        </DialogHeader>

        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            The library is empty. Add documents under Admin → Document Library, then attach them here.
          </p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="tenderId" value={tenderId} />

            {available.length > 1 ? (
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setAll(true)}>
                  Select all
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setAll(false)}>
                  Clear
                </Button>
              </div>
            ) : null}

            <ul className="space-y-1">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <label className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-muted">
                    <input
                      type="checkbox"
                      name={`doc:${doc.id}`}
                      value="true"
                      disabled={doc.attached}
                      checked={doc.attached || Boolean(checked[doc.id])}
                      onChange={(e) => setChecked((prev) => ({ ...prev, [doc.id]: e.target.checked }))}
                      className="mt-0.5 size-4 rounded border-input"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{doc.title}</span>
                      {doc.description ? (
                        <span className="block text-xs text-muted-foreground">{doc.description}</span>
                      ) : null}
                      {doc.attached ? (
                        <span className="block text-xs text-muted-foreground">Already attached</span>
                      ) : null}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <label className="flex items-start gap-2.5 border-t pt-3 text-sm">
              <input
                type="checkbox"
                name="isRequiredReturn"
                value="true"
                defaultChecked
                className="mt-0.5 size-4 rounded border-input"
              />
              <span>
                These must be completed and returned
                <span className="block text-xs text-muted-foreground">
                  Listed for suppliers as forms to fill in, sign, stamp and include in their envelope. Untick for
                  documents that are only to be read.
                </span>
              </span>
            </label>

            <DialogFooter>
              <Button type="submit" disabled={pending || available.length === 0}>
                {pending ? "Attaching..." : "Attach selected"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
