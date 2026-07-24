"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"

export function DeleteButton({
  id,
  action,
  confirmMessage = "Delete this record?",
}: {
  id: string
  action: (id: string) => Promise<ActionResult>
  confirmMessage?: string
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Delete"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return
        startTransition(async () => {
          const result = await action(id)
          if (result.success) {
            toast.success("Deleted.")
            router.refresh()
          } else {
            toast.error(result.error)
          }
        })
      }}
    >
      <Trash2 className="size-4 text-destructive" aria-hidden="true" />
    </Button>
  )
}
