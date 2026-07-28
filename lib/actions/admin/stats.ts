"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  label: z.string().trim().min(1, "Label is required.").max(100),
  value: z.string().trim().min(1, "Value is required.").max(50),
  icon: z.string().trim().max(50).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["active", "inactive"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    label: formData.get("label"),
    value: formData.get("value"),
    icon: formData.get("icon") ?? "",
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status") ?? "active",
  })
}

function revalidate() {
  revalidatePath("/admin/stats")
  revalidatePath("/")
}

export async function createStat(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_stats").insert({
    label: parsed.data.label,
    value: parsed.data.value,
    icon: parsed.data.icon || null,
    sort_order: parsed.data.sortOrder,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateStat(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("margaret_stats")
    .update({
      label: parsed.data.label,
      value: parsed.data.value,
      icon: parsed.data.icon || null,
      sort_order: parsed.data.sortOrder,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteStat(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_stats").delete().eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
