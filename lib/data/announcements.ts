import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const getActiveAnnouncements = cache(async () => {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data } = await supabase
    .from("margaret_announcements")
    .select("id, title, message, announcement_type, link_url, starts_at, ends_at")
    .eq("status", "published")
    .is("deleted_at", null)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("starts_at", { ascending: false, nullsFirst: false })

  return data ?? []
})
