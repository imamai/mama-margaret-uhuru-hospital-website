"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { textToBlocks } from "@/lib/actions/admin/blocks"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  summary: z.string().trim().max(500).optional().or(z.literal("")),
  body: z.string().trim().max(20000).optional().or(z.literal("")),
  mediaContactName: z.string().trim().max(200).optional().or(z.literal("")),
  mediaContactEmail: z.string().trim().email("Invalid email.").optional().or(z.literal("")),
  mediaContactPhone: z.string().trim().max(30).optional().or(z.literal("")),
  publishedAt: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    summary: formData.get("summary") ?? "",
    body: formData.get("body") ?? "",
    mediaContactName: formData.get("mediaContactName") ?? "",
    mediaContactEmail: formData.get("mediaContactEmail") ?? "",
    mediaContactPhone: formData.get("mediaContactPhone") ?? "",
    publishedAt: formData.get("publishedAt") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/press-releases")
  revalidatePath("/media")
}

async function maybeUploadFile(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "downloads", "press-releases", file)
}

export async function createPressRelease(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const fileUrl = await maybeUploadFile(supabase, formData)

  const { error } = await supabase.from("margaret_press_releases").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    summary: parsed.data.summary || null,
    content: textToBlocks(parsed.data.body ?? "") as never,
    file_url: fileUrl || null,
    media_contact_name: parsed.data.mediaContactName || null,
    media_contact_email: parsed.data.mediaContactEmail || null,
    media_contact_phone: parsed.data.mediaContactPhone || null,
    published_at: parsed.data.publishedAt || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updatePressRelease(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const fileUrl = await maybeUploadFile(supabase, formData)
  if (fileUrl === null) return { success: false, error: "File must be smaller than 10MB." }

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    summary: parsed.data.summary || null,
    content: textToBlocks(parsed.data.body ?? "") as never,
    media_contact_name: parsed.data.mediaContactName || null,
    media_contact_email: parsed.data.mediaContactEmail || null,
    media_contact_phone: parsed.data.mediaContactPhone || null,
    published_at: parsed.data.publishedAt || null,
    status: parsed.data.status,
  }
  if (fileUrl) update.file_url = fileUrl

  const { data, error } = await supabase.from("margaret_press_releases").update(update as never).eq("id", parsed.data.id).select("id")
  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deletePressRelease(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_press_releases").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
