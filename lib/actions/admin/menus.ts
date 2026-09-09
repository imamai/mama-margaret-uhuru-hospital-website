"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

function revalidate() {
  revalidatePath("/admin/menus")
  revalidatePath("/", "layout")
}

const menuItemSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  menu_id: z.string().uuid(),
  label: z.string().trim().min(1, "Label is required.").max(100),
  url: z.string().trim().min(1, "URL is required.").max(300),
  status: z.enum(["active", "inactive"]),
})

function parse(formData: FormData) {
  return menuItemSchema.safeParse({
    id: formData.get("id") ?? "",
    menu_id: formData.get("menu_id"),
    label: formData.get("label"),
    url: formData.get("url"),
    status: formData.get("status") ?? "active",
  })
}

export async function createMenuItem(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { count } = await supabase
    .from("margaret_menu_items")
    .select("id", { count: "exact", head: true })
    .eq("menu_id", parsed.data.menu_id)

  const { error } = await supabase.from("margaret_menu_items").insert({
    menu_id: parsed.data.menu_id,
    label: parsed.data.label,
    url: parsed.data.url,
    status: parsed.data.status,
    sort_order: (count ?? 0) + 1,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateMenuItem(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_menu_items")
    .update({ label: parsed.data.label, url: parsed.data.url, status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_menu_items").delete().eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

async function swapWithNeighbor(id: string, menuId: string, direction: "up" | "down"): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from("margaret_menu_items")
    .select("id, sort_order")
    .eq("menu_id", menuId)
    .order("sort_order", { ascending: true })

  if (!items) return { success: false, error: "Could not load menu items." }

  const index = items.findIndex((s) => s.id === id)
  const neighborIndex = direction === "up" ? index - 1 : index + 1
  if (index === -1 || neighborIndex < 0 || neighborIndex >= items.length) {
    return { success: true }
  }

  const current = items[index]
  const neighbor = items[neighborIndex]

  const [
    { data: d1, error: err1 },
    { data: d2, error: err2 },
  ] = await Promise.all([
    supabase.from("margaret_menu_items").update({ sort_order: neighbor.sort_order }).eq("id", current.id).select("id"),
    supabase.from("margaret_menu_items").update({ sort_order: current.sort_order }).eq("id", neighbor.id).select("id"),
  ])

  if (err1 || err2 || !d1?.length || !d2?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function moveMenuItemUp(id: string, menuId: string) {
  return swapWithNeighbor(id, menuId, "up")
}

export async function moveMenuItemDown(id: string, menuId: string) {
  return swapWithNeighbor(id, menuId, "down")
}
