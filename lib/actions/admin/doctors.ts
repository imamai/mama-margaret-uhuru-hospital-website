"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const doctorSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  full_name: z.string().trim().min(2, "Full name is required.").max(200),
  specialization: z.string().trim().min(2, "Specialization is required.").max(200),
  department_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().max(100).optional().or(z.literal("")),
  biography: z.string().trim().max(4000).optional().or(z.literal("")),
  years_experience: z.coerce.number().int().min(0).max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email address.").optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return doctorSchema.safeParse({
    id: formData.get("id") ?? "",
    full_name: formData.get("full_name"),
    specialization: formData.get("specialization"),
    department_id: formData.get("department_id") ?? "",
    title: formData.get("title") ?? "",
    biography: formData.get("biography") ?? "",
    years_experience: formData.get("years_experience") || "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/doctors")
  revalidatePath("/doctors")
}

export async function createDoctor(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_doctors").insert({
    full_name: parsed.data.full_name,
    slug: slugify(parsed.data.full_name),
    specialization: parsed.data.specialization,
    department_id: parsed.data.department_id || null,
    title: parsed.data.title || null,
    biography: parsed.data.biography || null,
    years_experience: parsed.data.years_experience || null,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }

  revalidate()
  return { success: true }
}

export async function updateDoctor(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("margaret_doctors")
    .update({
      full_name: parsed.data.full_name,
      specialization: parsed.data.specialization,
      department_id: parsed.data.department_id || null,
      title: parsed.data.title || null,
      biography: parsed.data.biography || null,
      years_experience: parsed.data.years_experience || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function deleteDoctor(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_doctors").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}
