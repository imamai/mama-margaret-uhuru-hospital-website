"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Name is required.").max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["active", "inactive"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status") ?? "active",
  })
}

function revalidate() {
  revalidatePath("/admin/service-categories")
  revalidatePath("/services")
}

export async function createServiceCategory(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_service_categories").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
    sort_order: parsed.data.sortOrder,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updateServiceCategory(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("margaret_service_categories")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      sort_order: parsed.data.sortOrder,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteServiceCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_service_categories").delete().eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
