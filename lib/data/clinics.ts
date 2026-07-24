import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listClinics = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_clinics")
    .select("id, name, slug, banner_image_url, description")
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
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (!clinic) return null

  const department = clinic.department_id
    ? (
        await supabase
          .from("margaret_departments")
          .select("id, name, slug")
          .eq("id", clinic.department_id)
          .maybeSingle()
      ).data
    : null

  return { ...clinic, department }
})
