"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { submitTenderClarification, type ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: ActionResult | null = null

export function ClarificationForm({ tenderId, tenderSlug }: { tenderId: string; tenderSlug: string }) {
  const [state, formAction, pending] = useActionState(submitTenderClarification, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Your question has been submitted. Answers are published on this page once reviewed.")
      formRef.current?.reset()
    } else {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="tenderId" value={tenderId} />
      <input type="hidden" name="tenderSlug" value={tenderSlug} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="askedByName">Full name</Label>
          <Input id="askedByName" name="askedByName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="askedByEmail">Email address</Label>
          <Input id="askedByEmail" name="askedByEmail" type="email" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="question">Your question</Label>
        <Textarea id="question" name="question" rows={3} required />
      </div>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Submitting..." : "Submit Question"}
      </Button>
    </form>
  )
}
