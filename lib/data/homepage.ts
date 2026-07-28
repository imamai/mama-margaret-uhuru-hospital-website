import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export type HomepageSection = {
  id: string
  section_key: string
  title: string | null
  sort_order: number
}

export const getVisibleHomepageSections = cache(async (): Promise<HomepageSection[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_homepage_sections")
    .select("id, section_key, title, sort_order")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getHeroSlides = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_hero_slides")
    .select("id, title, subtitle, image_url, video_url, cta_label, cta_url, focal_point")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getStats = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_stats")
    .select("id, label, value, icon")
    .eq("status", "active")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getTestimonials = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_testimonials")
    .select("id, patient_name, photo_url, quote, rating")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getInsurancePartners = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_insurance_partners")
    .select("id, name, logo_url, website_url")
    .eq("status", "active")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getAwards = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_awards")
    .select("id, title, awarding_body, image_url, awarded_year")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getPartners = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_partners")
    .select("id, name, logo_url, website_url, partner_type")
    .eq("status", "active")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const getGallery = cache(async (limit = 12) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_gallery")
    .select("id, title, media_type, file_url, thumbnail_url, caption")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(limit)
  return data ?? []
})
