import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listDoctors = cache(async (search?: string) => {
  const supabase = await createClient()
  let query = supabase
    .from("margaret_doctors")
    .select(
      "id, full_name, slug, photo_url, title, specialization, department_id, years_experience"
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,specialization.ilike.%${search}%`)
  }

  const { data } = await query
  return data ?? []
})

export const getDoctorBySlug = cache(async (slug: string) => {
  const supabase = await createClient()

  const { data: doctor } = await supabase
    .from("margaret_doctors")
    .select(
      "id, full_name, slug, photo_url, title, specialization, department_id, qualifications, languages, biography, years_experience, email, phone, linkedin_url, twitter_url"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (!doctor) return null

  const [{ data: department }, { data: availability }, { data: publications }, { data: awards }] =
    await Promise.all([
      doctor.department_id
        ? supabase
            .from("margaret_departments")
            .select("id, name, slug")
            .eq("id", doctor.department_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("margaret_doctor_availability")
        .select("id, day_of_week, start_time, end_time, location")
        .eq("doctor_id", doctor.id)
        .order("day_of_week", { ascending: true }),
      supabase
        .from("margaret_doctor_publications")
        .select("id, title, publication_url, published_year")
        .eq("doctor_id", doctor.id)
        .order("published_year", { ascending: false }),
      supabase
        .from("margaret_awards")
        .select("id, title, awarding_body, awarded_year")
        .eq("doctor_id", doctor.id)
        .eq("status", "published"),
    ])

  return {
    ...doctor,
    department: department ?? null,
    availability: availability ?? [],
    publications: publications ?? [],
    awards: awards ?? [],
  }
})
