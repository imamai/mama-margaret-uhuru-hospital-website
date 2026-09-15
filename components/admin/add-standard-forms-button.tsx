"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ListChecks } from "lucide-react"
import { toast } from "sonner"

import { addStandardRfqForms } from "@/lib/actions/admin/tenders"
import { Button } from "@/components/ui/button"

/**
 * Lists the nine forms every RFQ asks for, in one press.
 *
 * Typing them per tender is nine chances to leave one off, and a form left off
 * the list is a form no supplier is ever asked for and no evaluator misses.
 */
export function AddStandardFormsButton({ tenderId }: { tenderId: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await addStandardRfqForms(tenderId)
          if (result.success) {
            toast[result.warning ? "info" : "success"](
              result.warning ?? "Standard RFQ forms added to this tender.",
            )
            router.refresh()
          } else {
            toast.error(result.error)
          }
        })
      }
    >
      <ListChecks className="size-4" aria-hidden="true" />
      {pending ? "Adding…" : "Add standard RFQ forms"}
    </Button>
  )
}
