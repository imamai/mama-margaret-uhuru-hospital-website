"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { submitFeedback, type ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: ActionResult | null = null

export function FeedbackForm() {
  const [state, formAction, pending] = useActionState(submitFeedback, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Thank you for your feedback.")
      formRef.current?.reset()
    } else {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rating">Overall rating (1-5, optional)</Label>
        <Input id="rating" name="rating" type="number" min={1} max={5} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Your feedback</Label>
        <Textarea id="message" name="message" rows={4} required />
      </div>
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  )
}
