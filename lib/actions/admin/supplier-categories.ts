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
  status: z.enum(["active", "inactive"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    status: formData.get("status") ?? "active",
  })
}

function revalidate() {
  revalidatePath("/admin/supplier-categories")
  revalidatePath("/tenders")
}

export async function createSupplierCategory(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_supplier_categories").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updateSupplierCategory(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_supplier_categories")
    .update({ name: parsed.data.name, description: parsed.data.description || null, status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteSupplierCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_supplier_categories").delete().eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
