"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { submitJobApplication, type ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: ActionResult | null = null

export function JobApplicationForm({ jobId }: { jobId: string }) {
  const [state, formAction, pending] = useActionState(submitJobApplication, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Application submitted. We'll be in touch if you're shortlisted.")
      formRef.current?.reset()
    } else {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <input type="hidden" name="jobId" value={jobId} />
      {/* Honeypot -- hidden from real users via CSS, bots fill every field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" name="phone" type="tel" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coverLetter">Cover letter (optional)</Label>
        <Textarea id="coverLetter" name="coverLetter" rows={5} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FileField id="cv" label="CV / Resume" required />
        <FileField id="coverLetterFile" label="Cover letter (file)" />
        <FileField id="certificates" label="Certificates" />
        <FileField id="idDocument" label="National ID / Passport" required />
        <FileField id="professionalLicense" label="Professional license" />
        <FileField id="passportPhoto" label="Passport photo" required accept="image/*" />
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  )
}

function FileField({
  id,
  label,
  required,
  accept,
}: {
  id: string
  label: string
  required?: boolean
  accept?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input id={id} name={id} type="file" accept={accept ?? ".pdf,.doc,.docx,image/*"} required={required} />
    </div>
  )
}
