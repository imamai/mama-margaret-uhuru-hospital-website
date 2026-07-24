"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const departmentSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Name is required.").max(200),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email address.").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return departmentSchema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    location: formData.get("location") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/departments")
  revalidatePath("/departments")
}

export async function createDepartment(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_departments").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
    location: parsed.data.location || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }

  revalidate()
  return { success: true }
}

export async function updateDepartment(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("margaret_departments")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function deleteDepartment(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_departments").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}
