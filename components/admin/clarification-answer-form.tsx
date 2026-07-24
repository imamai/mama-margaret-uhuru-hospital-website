"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { answerClarification } from "@/lib/actions/admin/tenders"
import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const initialState: ActionResult | null = null

export function ClarificationAnswerForm({ id, tenderId }: { id: string; tenderId: string }) {
  const [state, formAction, pending] = useActionState(answerClarification, initialState)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Answer published.")
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <form action={formAction} className="mt-2 flex items-end gap-2">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="tenderId" value={tenderId} />
      <Textarea name="answer" placeholder="Write and publish an answer..." rows={2} required className="flex-1" />
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving..." : "Answer"}
      </Button>
    </form>
  )
}
