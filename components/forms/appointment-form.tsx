"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { submitAppointment, type ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const initialState: ActionResult | null = null

const nativeSelectClass = cn(
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
)

export function AppointmentForm({
  departments,
  defaultDepartmentId,
}: {
  departments: { id: string; name: string }[]
  defaultDepartmentId?: string
}) {
  const [state, formAction, pending] = useActionState(submitAppointment, initialState)
  const [isInsured, setIsInsured] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Appointment request received. Our team will confirm shortly.")
      formRef.current?.reset()
      // Resets the conditional insurance-provider field after a successful submit.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInsured(false)
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
          <Label htmlFor="patientName">Full name</Label>
          <Input id="patientName" name="patientName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patientPhone">Phone number</Label>
          <Input id="patientPhone" name="patientPhone" type="tel" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="patientEmail">Email (optional)</Label>
        <Input id="patientEmail" name="patientEmail" type="email" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="departmentId">Department</Label>
          <select id="departmentId" name="departmentId" defaultValue={defaultDepartmentId ?? ""} className={nativeSelectClass}>
            <option value="">Not sure / any department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferredDate">Preferred date</Label>
          <Input id="preferredDate" name="preferredDate" type="date" min={new Date().toISOString().slice(0, 10)} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="preferredTime">Preferred time (optional)</Label>
        <Input id="preferredTime" name="preferredTime" type="time" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reason">Reason for visit (optional)</Label>
        <Textarea id="reason" name="reason" rows={4} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="isInsured">Do you have insurance cover?</Label>
        <select
          id="isInsured"
          name="isInsured"
          className={nativeSelectClass}
          value={String(isInsured)}
          onChange={(e) => setIsInsured(e.target.value === "true")}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>

      {isInsured ? (
        <div className="space-y-1.5">
          <Label htmlFor="insuranceProvider">Insurance provider</Label>
          <Input id="insuranceProvider" name="insuranceProvider" />
        </div>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Submitting..." : "Request Appointment"}
      </Button>
    </form>
  )
}
