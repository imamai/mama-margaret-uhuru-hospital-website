import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listUpcomingEvents = cache(async (limit = 6) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_events")
    .select(
      "id, title, slug, event_type, featured_image_url, location, is_virtual, starts_at, ends_at, registration_required"
    )
    .eq("status", "published")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit)
  return data ?? []
})

export const getEventBySlug = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_events")
    .select(
      "id, title, slug, event_type, description, featured_image_url, location, is_virtual, virtual_link, starts_at, ends_at, registration_required, registration_deadline, capacity, seo_title, seo_description"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  return data ?? null
})
