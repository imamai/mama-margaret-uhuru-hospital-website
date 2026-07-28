"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { addDoctorAvailability } from "@/lib/actions/admin/doctor-relations"
import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const initialState: ActionResult | null = null

export function DoctorAvailabilityForm({ doctorId }: { doctorId: string }) {
  const [state, formAction, pending] = useActionState(addDoctorAvailability, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Availability added.")
      formRef.current?.reset()
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <input type="hidden" name="doctorId" value={doctorId} />
      <div className="space-y-1.5">
        <Label htmlFor="avail-day">Day</Label>
        <select
          id="avail-day"
          name="dayOfWeek"
          defaultValue="1"
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {DAYS.map((day, index) => (
            <option key={day} value={index}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="avail-start">Start time</Label>
        <Input id="avail-start" name="startTime" type="time" required className="w-32" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="avail-end">End time</Label>
        <Input id="avail-end" name="endTime" type="time" required className="w-32" />
      </div>
      <div className="min-w-40 flex-1 space-y-1.5">
        <Label htmlFor="avail-location">Location (optional)</Label>
        <Input id="avail-location" name="location" placeholder="e.g. Main Clinic, Room 4" />
      </div>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}
