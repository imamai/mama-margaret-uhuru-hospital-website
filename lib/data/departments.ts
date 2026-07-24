import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listDepartments = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_departments")
    .select("id, name, slug, banner_image_url, description, location, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getDepartmentBySlug = cache(async (slug: string) => {
  const supabase = await createClient()

  const { data: department } = await supabase
    .from("margaret_departments")
    .select(
      "id, name, slug, banner_image_url, description, operating_hours, phone, email, location, seo_title, seo_description"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (!department) return null

  const [{ data: doctorLinks }, { data: services }, { data: gallery }, { data: downloads }] =
    await Promise.all([
      supabase
        .from("margaret_department_doctors")
        .select("margaret_doctors(id, full_name, slug, photo_url, title, specialization)")
        .eq("department_id", department.id),
      supabase
        .from("margaret_services")
        .select("id, name, slug, description, image_url, price_info")
        .eq("department_id", department.id)
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
      supabase
        .from("margaret_gallery")
        .select("id, title, media_type, file_url, thumbnail_url, caption")
        .eq("module", "department")
        .eq("reference_id", department.id)
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
      supabase
        .from("margaret_downloads")
        .select("id, title, file_url, file_type, category")
        .eq("module", "department")
        .eq("reference_id", department.id)
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
    ])

  const doctors = (doctorLinks ?? [])
    .map((link) => link.margaret_doctors)
    .filter((doctor): doctor is NonNullable<typeof doctor> => doctor !== null)

  return {
    ...department,
    doctors,
    services: services ?? [],
    gallery: gallery ?? [],
    downloads: downloads ?? [],
  }
})
