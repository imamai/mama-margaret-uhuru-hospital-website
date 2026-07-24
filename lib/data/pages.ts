import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const getPageBySlug = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data: page } = await supabase
    .from("margaret_pages")
    .select("id, title, slug, excerpt, content, featured_image_url, seo_title, seo_description, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (!page) return null

  const { data: downloads } = await supabase
    .from("margaret_downloads")
    .select("id, title, file_url, file_type")
    .eq("module", "page")
    .eq("reference_id", page.id)
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  return { ...page, downloads: downloads ?? [] }
})
