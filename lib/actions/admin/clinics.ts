"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Name is required.").max(200),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  services: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    departmentId: formData.get("departmentId") ?? "",
    description: formData.get("description") ?? "",
    services: formData.get("services") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function toList(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean)
}

function revalidate() {
  revalidatePath("/admin/clinics")
  revalidatePath("/clinics")
}

async function maybeUploadImage(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("bannerImage")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (!file.type.startsWith("image/")) return null
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "department-media", "clinics", file)
}

export async function createClinic(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const bannerUrl = await maybeUploadImage(supabase, formData)

  const { error } = await supabase.from("margaret_clinics").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    department_id: parsed.data.departmentId || null,
    description: parsed.data.description || null,
    services: toList(parsed.data.services ?? ""),
    banner_image_url: bannerUrl || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updateClinic(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const bannerUrl = await maybeUploadImage(supabase, formData)
  if (bannerUrl === null) return { success: false, error: "Image must be a valid file under 10MB." }

  const update: Record<string, unknown> = {
    name: parsed.data.name,
    department_id: parsed.data.departmentId || null,
    description: parsed.data.description || null,
    services: toList(parsed.data.services ?? ""),
    status: parsed.data.status,
  }
  if (bannerUrl) update.banner_image_url = bannerUrl

  const { error } = await supabase.from("margaret_clinics").update(update as never).eq("id", parsed.data.id)
  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteClinic(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_clinics").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
