"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    category: formData.get("category") ?? "",
    status: formData.get("status") ?? "published",
  })
}

function revalidate() {
  revalidatePath("/admin/downloads")
  revalidatePath("/downloads")
}

export async function createDownload(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Please choose a file." }
  if (file.size > MAX_UPLOAD_BYTES) return { success: false, error: "File must be smaller than 10MB." }

  const supabase = await createClient()
  const fileUrl = await uploadPublicFile(supabase, "downloads", "general", file)
  if (!fileUrl) return { success: false, error: "You don't have permission to upload files." }

  const { error } = await supabase.from("margaret_downloads").insert({
    title: parsed.data.title,
    file_url: fileUrl,
    file_type: file.type || null,
    file_size_kb: Math.round(file.size / 1024),
    category: parsed.data.category || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateDownload(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    category: parsed.data.category || null,
    status: parsed.data.status,
  }

  const file = formData.get("file")
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) return { success: false, error: "File must be smaller than 10MB." }
    const fileUrl = await uploadPublicFile(supabase, "downloads", "general", file)
    if (!fileUrl) return { success: false, error: "You don't have permission to upload files." }
    update.file_url = fileUrl
    update.file_type = file.type || null
    update.file_size_kb = Math.round(file.size / 1024)
  }

  const { data, error } = await supabase.from("margaret_downloads").update(update as never).eq("id", parsed.data.id).select("id")
  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteDownload(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_downloads").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
