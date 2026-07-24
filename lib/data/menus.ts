import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export type MenuItem = {
  id: string
  label: string
  url: string | null
  icon: string | null
  sort_order: number
  open_in_new_tab: boolean
  children: MenuItem[]
}

async function getMenuBySlug(slug: string): Promise<MenuItem[]> {
  const supabase = await createClient()

  const { data: menu } = await supabase
    .from("margaret_menus")
    .select("id")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle()

  if (!menu) return []

  const { data: items } = await supabase
    .from("margaret_menu_items")
    .select("id, parent_id, label, url, icon, sort_order, open_in_new_tab")
    .eq("menu_id", menu.id)
    .eq("status", "active")
    .order("sort_order", { ascending: true })

  if (!items) return []

  const byParent = new Map<string | null, typeof items>()
  for (const item of items) {
    const key = item.parent_id
    byParent.set(key, [...(byParent.get(key) ?? []), item])
  }

  function build(parentId: string | null): MenuItem[] {
    return (byParent.get(parentId) ?? []).map((item) => ({
      id: item.id,
      label: item.label,
      url: item.url,
      icon: item.icon,
      sort_order: item.sort_order,
      open_in_new_tab: item.open_in_new_tab,
      children: build(item.id),
    }))
  }

  return build(null)
}

export const getPrimaryNav = cache(() => getMenuBySlug("primary-nav"))
export const getFooterNav = cache(() => getMenuBySlug("footer-nav"))
