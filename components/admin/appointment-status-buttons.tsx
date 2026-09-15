"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import { toast } from "sonner"

import { setAppointmentStatus, type AppointmentStatus } from "@/lib/actions/admin/appointments"
import { Button } from "@/components/ui/button"

/**
 * Confirm or decline without opening anything.
 *
 * The desk's whole job on this screen is turning `pending` into `confirmed` a
 * few dozen times a morning. Making that a dialogue would put three clicks and
 * a form in front of the one action that matters, so it is a button.
 *
 * Only shown while a request is still pending — a decision already made is
 * changed in the edit dialogue, deliberately, so it cannot be undone by a
 * mis-tap.
 */
export function AppointmentStatusButtons({ id }: { id: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function move(status: AppointmentStatus, done: string) {
    startTransition(async () => {
      const result = await setAppointmentStatus(id, status)
      if (result.success) {
        toast.success(done)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Confirm appointment"
        title="Confirm"
        disabled={pending}
        onClick={() => move("confirmed", "Appointment confirmed.")}
      >
        <Check className="size-4 text-emerald-600" aria-hidden="true" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Cancel appointment"
        title="Cancel"
        disabled={pending}
        onClick={() => {
          if (!window.confirm("Cancel this appointment request?")) return
          move("cancelled", "Appointment cancelled.")
        }}
      >
        <X className="size-4 text-destructive" aria-hidden="true" />
      </Button>
    </>
  )
}
