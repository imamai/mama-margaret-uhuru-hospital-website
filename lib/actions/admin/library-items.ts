"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const ITEM_TYPES = ["publication", "guideline", "manual", "annual_report"] as const

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  itemType: z.enum(ITEM_TYPES),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  publishedYear: z.coerce.number().int().optional(),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    itemType: formData.get("itemType") ?? "publication",
    description: formData.get("description") ?? "",
    publishedYear: formData.get("publishedYear") || undefined,
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/library-items")
  revalidatePath("/library")
}

export async function createLibraryItem(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Please choose a file." }
  if (file.size > MAX_UPLOAD_BYTES) return { success: false, error: "File must be smaller than 10MB." }

  const supabase = await createClient()
  const fileUrl = await uploadPublicFile(supabase, "downloads", "library", file)
  if (!fileUrl) return { success: false, error: "You don't have permission to upload files." }

  const { error } = await supabase.from("margaret_library_items").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    item_type: parsed.data.itemType,
    description: parsed.data.description || null,
    file_url: fileUrl,
    published_year: parsed.data.publishedYear ?? null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updateLibraryItem(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    item_type: parsed.data.itemType,
    description: parsed.data.description || null,
    published_year: parsed.data.publishedYear ?? null,
    status: parsed.data.status,
  }

  const file = formData.get("file")
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) return { success: false, error: "File must be smaller than 10MB." }
    const fileUrl = await uploadPublicFile(supabase, "downloads", "library", file)
    if (!fileUrl) return { success: false, error: "You don't have permission to upload files." }
    update.file_url = fileUrl
  }

  const { error } = await supabase.from("margaret_library_items").update(update as never).eq("id", parsed.data.id)
  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteLibraryItem(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_library_items").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
