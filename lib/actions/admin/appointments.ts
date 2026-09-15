"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

/**
 * Triage for appointment requests.
 *
 * Appointments are not content: nobody creates one here. A patient books on
 * the public site, the row lands as `pending`, and the desk works through
 * them — confirming, assigning a doctor, or marking what happened afterwards.
 * So there is no create action, only update and a soft delete.
 *
 * Permission is enforced by RLS (appointments.manage), not by this file. A
 * failed write means the account may not do it, which is why the error says so
 * rather than inventing a cause.
 */

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"] as const

export type AppointmentStatus = (typeof STATUSES)[number]

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(STATUSES),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  doctorId: z.string().uuid().optional().or(z.literal("")),
  preferredDate: z.string().optional().or(z.literal("")),
  preferredTime: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
})

function revalidate() {
  revalidatePath("/admin/appointments")
}

/**
 * Update one request: its status, who it is for, when, and the desk's note.
 *
 * The preferred date and time stay editable because a confirmation often moves
 * them — the patient asked for Thursday, the clinic offers Friday. Recording
 * that here keeps one row per request rather than a cancelled one and a new one.
 */
export async function updateAppointment(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = schema.safeParse({
    id: formData.get("id"),
    status: formData.get("status") ?? "pending",
    departmentId: formData.get("departmentId") ?? "",
    doctorId: formData.get("doctorId") ?? "",
    preferredDate: formData.get("preferredDate") ?? "",
    preferredTime: formData.get("preferredTime") ?? "",
    notes: formData.get("notes") ?? "",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_appointments")
    .update({
      status: parsed.data.status,
      department_id: parsed.data.departmentId || null,
      doctor_id: parsed.data.doctorId || null,
      ...(parsed.data.preferredDate ? { preferred_date: parsed.data.preferredDate } : {}),
      preferred_time: parsed.data.preferredTime || null,
      notes: parsed.data.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select("id")

  if (error) return { success: false, error: "You don't have permission to do this." }
  // RLS refuses by returning nothing rather than erroring, so an empty result
  // is the real signal that the write did not happen.
  if (!data || data.length === 0) {
    return { success: false, error: "That request could not be updated." }
  }

  revalidate()
  return { success: true }
}

/** Move a request straight to a status, for the buttons on each row. */
export async function setAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<ActionResult> {
  if (!STATUSES.includes(status)) return { success: false, error: "Unknown status." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_appointments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error) return { success: false, error: "You don't have permission to do this." }
  if (!data || data.length === 0) {
    return { success: false, error: "That request could not be updated." }
  }

  revalidate()
  return { success: true }
}

/**
 * Remove a request from the desk's list.
 *
 * Soft, because an appointment request is a record of somebody asking for care.
 * Cancelled is a status; deleted_at is for a duplicate or a test booking, and
 * even then the row stays.
 */
export async function deleteAppointment(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_appointments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error) return { success: false, error: "You don't have permission to do this." }
  if (!data || data.length === 0) {
    return { success: false, error: "That request could not be removed." }
  }

  revalidate()
  return { success: true }
}
