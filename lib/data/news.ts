import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listNewsCategories = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_news_categories")
    .select("id, name, slug")
    .eq("status", "active")
    .order("name", { ascending: true })
  return data ?? []
})

export const listNews = cache(
  async (opts: { categorySlug?: string; featuredOnly?: boolean; limit?: number } = {}) => {
    const supabase = await createClient()
    let query = supabase
      .from("margaret_news")
      .select(
        "id, title, slug, excerpt, featured_image_url, author_name, tags, is_featured, is_breaking, published_at, category_id"
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (opts.featuredOnly) query = query.eq("is_featured", true)
    if (opts.limit) query = query.limit(opts.limit)

    if (opts.categorySlug) {
      const { data: category } = await supabase
        .from("margaret_news_categories")
        .select("id")
        .eq("slug", opts.categorySlug)
        .maybeSingle()
      if (!category) return []
      query = query.eq("category_id", category.id)
    }

    const { data } = await query
    return data ?? []
  }
)

export const listBreakingNews = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_news")
    .select("id, title, slug")
    .eq("status", "published")
    .eq("is_breaking", true)
    .order("published_at", { ascending: false })
    .limit(5)
  return data ?? []
})

export const getNewsBySlug = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_news")
    .select(
      "id, title, slug, excerpt, content, featured_image_url, author_name, tags, is_breaking, published_at, view_count, seo_title, seo_description"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  return data ?? null
})
