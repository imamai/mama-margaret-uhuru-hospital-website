"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { addDoctorPublication } from "@/lib/actions/admin/doctor-relations"
import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: ActionResult | null = null

export function DoctorPublicationForm({ doctorId }: { doctorId: string }) {
  const [state, formAction, pending] = useActionState(addDoctorPublication, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Publication added.")
      formRef.current?.reset()
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <input type="hidden" name="doctorId" value={doctorId} />
      <div className="min-w-48 flex-1 space-y-1.5">
        <Label htmlFor="pub-title">Title</Label>
        <Input id="pub-title" name="title" required />
      </div>
      <div className="min-w-48 flex-1 space-y-1.5">
        <Label htmlFor="pub-url">URL (optional)</Label>
        <Input id="pub-url" name="publicationUrl" type="url" placeholder="https://..." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pub-year">Year (optional)</Label>
        <Input id="pub-year" name="publishedYear" type="number" min={1950} max={2100} className="w-24" />
      </div>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}
