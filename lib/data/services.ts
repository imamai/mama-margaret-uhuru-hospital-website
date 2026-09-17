import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listServiceCategories = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_service_categories")
    .select("id, name, slug, description")
    .is("deleted_at", null)
    .eq("status", "active")
    .order("sort_order", { ascending: true })
  return data ?? []
})

export const listServices = cache(async (search?: string) => {
  const supabase = await createClient()
  let query = supabase
    .from("margaret_services")
    .select("id, name, slug, category_id, description, image_url, price_info")
    .is("deleted_at", null)
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  const { data } = await query
  return data ?? []
})
