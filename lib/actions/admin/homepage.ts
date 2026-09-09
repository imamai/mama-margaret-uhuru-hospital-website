"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

function revalidate() {
  revalidatePath("/admin/homepage")
  revalidatePath("/")
}

export async function toggleSectionVisibility(id: string, nextVisible: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_homepage_sections").update({ is_visible: nextVisible }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

async function swapWithNeighbor(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: sections } = await supabase
    .from("margaret_homepage_sections")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })

  if (!sections) return { success: false, error: "Could not load sections." }

  const index = sections.findIndex((s) => s.id === id)
  const neighborIndex = direction === "up" ? index - 1 : index + 1
  if (index === -1 || neighborIndex < 0 || neighborIndex >= sections.length) {
    return { success: true } // already at the edge, nothing to do
  }

  const current = sections[index]
  const neighbor = sections[neighborIndex]

  const [
    { data: d1, error: err1 },
    { data: d2, error: err2 },
  ] = await Promise.all([
    supabase.from("margaret_homepage_sections").update({ sort_order: neighbor.sort_order }).eq("id", current.id).select("id"),
    supabase.from("margaret_homepage_sections").update({ sort_order: current.sort_order }).eq("id", neighbor.id).select("id"),
  ])

  if (err1 || err2 || !d1?.length || !d2?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function moveSectionUp(id: string) {
  return swapWithNeighbor(id, "up")
}

export async function moveSectionDown(id: string) {
  return swapWithNeighbor(id, "down")
}
