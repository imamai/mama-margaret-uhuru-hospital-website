"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  awardingBody: z.string().trim().max(200).optional().or(z.literal("")),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  awardedYear: z.coerce.number().int().optional(),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    awardingBody: formData.get("awardingBody") ?? "",
    departmentId: formData.get("departmentId") ?? "",
    description: formData.get("description") ?? "",
    awardedYear: formData.get("awardedYear") || undefined,
    status: formData.get("status") ?? "published",
  })
}

function revalidate() {
  revalidatePath("/admin/awards")
  revalidatePath("/")
}

async function maybeUploadImage(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("image")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (!file.type.startsWith("image/")) return null
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "gallery", "awards", file)
}

export async function createAward(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)

  const { error } = await supabase.from("margaret_awards").insert({
    title: parsed.data.title,
    awarding_body: parsed.data.awardingBody || null,
    department_id: parsed.data.departmentId || null,
    description: parsed.data.description || null,
    awarded_year: parsed.data.awardedYear ?? null,
    image_url: imageUrl || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateAward(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)
  if (imageUrl === null) return { success: false, error: "Image must be a valid file under 10MB." }

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    awarding_body: parsed.data.awardingBody || null,
    department_id: parsed.data.departmentId || null,
    description: parsed.data.description || null,
    awarded_year: parsed.data.awardedYear ?? null,
    status: parsed.data.status,
  }
  if (imageUrl) update.image_url = imageUrl

  const { data, error } = await supabase.from("margaret_awards").update(update as never).eq("id", parsed.data.id).select("id")
  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteAward(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_awards").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
