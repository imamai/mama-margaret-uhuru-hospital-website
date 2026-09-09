"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { resolveImageInput } from "@/lib/actions/admin/storage"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const FACILITY_TYPES = ["operating_theatre", "laboratory", "radiology", "pharmacy", "maternity", "emergency", "general"] as const

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Name is required.").max(200),
  facilityType: z.enum(FACILITY_TYPES),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  equipment: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    facilityType: formData.get("facilityType") ?? "general",
    departmentId: formData.get("departmentId") ?? "",
    description: formData.get("description") ?? "",
    equipment: formData.get("equipment") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function toList(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean)
}

function revalidate() {
  revalidatePath("/admin/facilities")
  revalidatePath("/facilities")
}

async function maybeUploadImage(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  return resolveImageInput(supabase, formData, "image", "department-media", "facilities")
}

export async function createFacility(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)

  const { error } = await supabase.from("margaret_facilities").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    facility_type: parsed.data.facilityType,
    department_id: parsed.data.departmentId || null,
    description: parsed.data.description || null,
    equipment: toList(parsed.data.equipment ?? ""),
    image_url: imageUrl || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updateFacility(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)
  if (imageUrl === null) return { success: false, error: "Image must be a valid file under 10MB." }

  const update: Record<string, unknown> = {
    name: parsed.data.name,
    facility_type: parsed.data.facilityType,
    department_id: parsed.data.departmentId || null,
    description: parsed.data.description || null,
    equipment: toList(parsed.data.equipment ?? ""),
    status: parsed.data.status,
  }
  if (imageUrl) update.image_url = imageUrl

  const { data, error } = await supabase.from("margaret_facilities").update(update as never).eq("id", parsed.data.id).select("id")
  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteFacility(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_facilities").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
