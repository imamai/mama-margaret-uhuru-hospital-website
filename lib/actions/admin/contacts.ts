"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

const CONTACT_TYPES = ["department", "emergency", "general", "media"] as const

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Name is required.").max(200),
  contactType: z.enum(CONTACT_TYPES),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  alternatePhone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email.").optional().or(z.literal("")),
  location: z.string().trim().max(300).optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    contactType: formData.get("contactType") ?? "general",
    departmentId: formData.get("departmentId") ?? "",
    phone: formData.get("phone") ?? "",
    alternatePhone: formData.get("alternatePhone") ?? "",
    email: formData.get("email") ?? "",
    location: formData.get("location") ?? "",
    status: formData.get("status") ?? "active",
  })
}

function revalidate() {
  revalidatePath("/admin/contacts")
  revalidatePath("/contact")
}

export async function createContact(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_contacts").insert({
    name: parsed.data.name,
    contact_type: parsed.data.contactType,
    department_id: parsed.data.departmentId || null,
    phone: parsed.data.phone || null,
    alternate_phone: parsed.data.alternatePhone || null,
    email: parsed.data.email || null,
    location: parsed.data.location || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateContact(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("margaret_contacts")
    .update({
      name: parsed.data.name,
      contact_type: parsed.data.contactType,
      department_id: parsed.data.departmentId || null,
      phone: parsed.data.phone || null,
      alternate_phone: parsed.data.alternatePhone || null,
      email: parsed.data.email || null,
      location: parsed.data.location || null,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteContact(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_contacts").delete().eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
