import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listClinics = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_clinics")
    .select("id, name, slug, banner_image_url, description, updated_at")
    .is("deleted_at", null)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getClinicBySlug = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data: clinic } = await supabase
    .from("margaret_clinics")
    .select(
      "id, name, slug, department_id, banner_image_url, description, services, operating_hours, seo_title, seo_description"
    )
    .is("deleted_at", null)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (!clinic) return null

  const department = clinic.department_id
    ? (
        await supabase
          .from("margaret_departments")
          .select("id, name, slug")
          .is("deleted_at", null)
          .eq("id", clinic.department_id)
          .maybeSingle()
      ).data
    : null

  return { ...clinic, department }
})

/**
 * The published weekly consultant timetable, in the order a patient reads it:
 * by day, then by the time the clinic opens.
 */
export const listClinicSchedule = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_clinic_schedule")
    .select("id, clinic_label, clinic_id, day_of_week, start_time, end_time, specialist_name, specialist_role, room")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true })
    .order("sort_order", { ascending: true })
  return data ?? []
})
