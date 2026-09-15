"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

function revalidate(doctorId: string) {
  revalidatePath(`/admin/doctors/${doctorId}`)
  revalidatePath("/doctors")
}

const availabilitySchema = z.object({
  doctorId: z.string().uuid(),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  location: z.string().trim().max(200).optional().or(z.literal("")),
})

export async function addDoctorAvailability(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = availabilitySchema.safeParse({
    doctorId: formData.get("doctorId"),
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    location: formData.get("location") ?? "",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_doctor_availability").insert({
    doctor_id: parsed.data.doctorId,
    day_of_week: parsed.data.dayOfWeek,
    start_time: parsed.data.startTime,
    end_time: parsed.data.endTime,
    location: parsed.data.location || null,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate(parsed.data.doctorId)
  return { success: true }
}

/**
 * Takes only the row id; the doctor is read back from the deleted row.
 *
 * Passing `(slotId) => deleteDoctorAvailability(slotId, doctor.id)` into a
 * client component hands React a plain arrow rather than a server action, which
 * it refuses to serialise — so the page threw as soon as there was a row to
 * render a delete button for.
 */
export async function deleteDoctorAvailability(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_doctor_availability")
    .delete()
    .eq("id", id)
    .select("id, doctor_id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate(data[0].doctor_id)
  return { success: true }
}

const publicationSchema = z.object({
  doctorId: z.string().uuid(),
  title: z.string().trim().min(2, "Title is required.").max(300),
  publicationUrl: z.string().trim().max(500).optional().or(z.literal("")),
  publishedYear: z.coerce.number().int().min(1950).max(2100).optional().or(z.literal("")),
})

export async function addDoctorPublication(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = publicationSchema.safeParse({
    doctorId: formData.get("doctorId"),
    title: formData.get("title"),
    publicationUrl: formData.get("publicationUrl") ?? "",
    publishedYear: formData.get("publishedYear") || "",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_doctor_publications").insert({
    doctor_id: parsed.data.doctorId,
    title: parsed.data.title,
    publication_url: parsed.data.publicationUrl || null,
    published_year: parsed.data.publishedYear || null,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate(parsed.data.doctorId)
  return { success: true }
}

/** Takes only the row id — see deleteDoctorAvailability. */
export async function deleteDoctorPublication(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_doctor_publications")
    .delete()
    .eq("id", id)
    .select("id, doctor_id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate(data[0].doctor_id)
  return { success: true }
}
