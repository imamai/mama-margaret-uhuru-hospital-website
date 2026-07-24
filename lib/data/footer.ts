import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const getFooterSections = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_footer_sections")
    .select("id, title, content")
    .eq("status", "active")
    .order("sort_order", { ascending: true })
  return data ?? []
})
