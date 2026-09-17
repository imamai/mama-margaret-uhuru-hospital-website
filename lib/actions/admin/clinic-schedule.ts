"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

/**
 * The consultant clinic timetable.
 *
 * Covered by the clinics permission, like the table's RLS: anyone who can edit
 * a clinic can edit when it runs. A failed write means the account may not do
 * it, or a duplicate sitting — Postgres says which, and so does the message.
 */

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  clinicId: z.string().uuid().optional().or(z.literal("")),
  clinicLabel: z.string().trim().max(200).optional().or(z.literal("")),
  dayOfWeek: z.coerce.number().int().min(1, "Choose a day.").max(7),
  startTime: z.string().trim().regex(TIME, "Start time must look like 08:00."),
  endTime: z.string().trim().regex(TIME, "End time must look like 13:00.").optional().or(z.literal("")),
  specialistName: z.string().trim().max(200).optional().or(z.literal("")),
  specialistRole: z.string().trim().max(200).optional().or(z.literal("")),
  doctorId: z.string().uuid().optional().or(z.literal("")),
  room: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    clinicId: formData.get("clinicId") ?? "",
    clinicLabel: formData.get("clinicLabel") ?? "",
    dayOfWeek: formData.get("dayOfWeek") ?? 0,
    startTime: formData.get("startTime") ?? "",
    endTime: formData.get("endTime") ?? "",
    specialistName: formData.get("specialistName") ?? "",
    specialistRole: formData.get("specialistRole") ?? "",
    doctorId: formData.get("doctorId") ?? "",
    room: formData.get("room") ?? "",
    notes: formData.get("notes") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status") ?? "published",
  })
}

function writeError(code: string | undefined): string {
  if (code === "23505") return "That clinic already has a sitting at that time on that day."
  if (code === "42501") return "You don't have permission to do this."
  return "We couldn't save that. Check the fields and try again."
}

function revalidate() {
  revalidatePath("/admin/clinic-schedule")
  revalidatePath("/clinics")
}

/**
 * The label is what the timetable shows. Picking a clinic fills it in; typing
 * one covers a clinic that has no page of its own. One of the two is required.
 */
async function rowFrom(data: z.infer<typeof schema>) {
  const supabase = await createClient()
  let label = data.clinicLabel || ""

  if (data.clinicId && !label) {
    const { data: clinic } = await supabase
      .from("margaret_clinics")
      .select("name")
      .eq("id", data.clinicId)
      .maybeSingle()
    label = clinic?.name ?? ""
  }

  return {
    supabase,
    label,
    row: {
      clinic_id: data.clinicId || null,
      clinic_label: label,
      day_of_week: data.dayOfWeek,
      start_time: data.startTime,
      end_time: data.endTime || null,
      specialist_name: data.specialistName || null,
      specialist_role: data.specialistRole || null,
      doctor_id: data.doctorId || null,
      room: data.room || null,
      notes: data.notes || null,
      sort_order: data.sortOrder,
      status: data.status,
    },
  }
}

export async function createScheduleEntry(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const { supabase, label, row } = await rowFrom(parsed.data)
  if (!label) return { success: false, error: "Choose a clinic, or type the clinic name." }

  const { error } = await supabase.from("margaret_clinic_schedule").insert(row)
  if (error) return { success: false, error: writeError(error.code) }

  revalidate()
  return { success: true }
}

export async function updateScheduleEntry(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const { supabase, label, row } = await rowFrom(parsed.data)
  if (!label) return { success: false, error: "Choose a clinic, or type the clinic name." }

  const { data, error } = await supabase
    .from("margaret_clinic_schedule")
    .update(row)
    .eq("id", parsed.data.id)
    .select("id")

  if (error) return { success: false, error: writeError(error.code) }
  if (!data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

/** Soft, like every other content table: off the site at once, recoverable. */
export async function deleteScheduleEntry(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_clinic_schedule")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}
