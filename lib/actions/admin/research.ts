"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  abstract: z.string().trim().max(4000).optional().or(z.literal("")),
  authors: z.string().trim().max(1000).optional().or(z.literal("")),
  doctorId: z.string().uuid().optional().or(z.literal("")),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  publicationUrl: z.string().trim().max(500).optional().or(z.literal("")),
  publishedYear: z.coerce.number().int().optional(),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    abstract: formData.get("abstract") ?? "",
    authors: formData.get("authors") ?? "",
    doctorId: formData.get("doctorId") ?? "",
    departmentId: formData.get("departmentId") ?? "",
    publicationUrl: formData.get("publicationUrl") ?? "",
    publishedYear: formData.get("publishedYear") || undefined,
    status: formData.get("status") ?? "draft",
  })
}

function toList(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean)
}

function revalidate() {
  revalidatePath("/admin/research")
  revalidatePath("/research")
}

async function maybeUploadFile(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "downloads", "research", file)
}

export async function createResearch(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const fileUrl = await maybeUploadFile(supabase, formData)

  const { error } = await supabase.from("margaret_research").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    abstract: parsed.data.abstract || null,
    authors: toList(parsed.data.authors ?? ""),
    doctor_id: parsed.data.doctorId || null,
    department_id: parsed.data.departmentId || null,
    publication_url: parsed.data.publicationUrl || null,
    file_url: fileUrl || null,
    published_year: parsed.data.publishedYear ?? null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updateResearch(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const fileUrl = await maybeUploadFile(supabase, formData)
  if (fileUrl === null) return { success: false, error: "File must be smaller than 10MB." }

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    abstract: parsed.data.abstract || null,
    authors: toList(parsed.data.authors ?? ""),
    doctor_id: parsed.data.doctorId || null,
    department_id: parsed.data.departmentId || null,
    publication_url: parsed.data.publicationUrl || null,
    published_year: parsed.data.publishedYear ?? null,
    status: parsed.data.status,
  }
  if (fileUrl) update.file_url = fileUrl

  const { error } = await supabase.from("margaret_research").update(update as never).eq("id", parsed.data.id)
  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteResearch(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_research").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
