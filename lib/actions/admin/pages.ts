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
  parentId: z.string().uuid().optional().or(z.literal("")),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  body: z.string().trim().max(20000).optional().or(z.literal("")),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    parentId: formData.get("parentId") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    body: formData.get("body") ?? "",
    seoTitle: formData.get("seoTitle") ?? "",
    seoDescription: formData.get("seoDescription") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate(slug?: string) {
  revalidatePath("/admin/pages")
  if (slug) revalidatePath(`/pages/${slug}`)
}

async function maybeUploadImage(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("featuredImage")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (!file.type.startsWith("image/")) return null
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "gallery", "pages", file)
}

export async function createPage(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)
  const slug = slugify(parsed.data.title)

  const { error } = await supabase.from("margaret_pages").insert({
    title: parsed.data.title,
    slug,
    parent_id: parsed.data.parentId || null,
    excerpt: parsed.data.excerpt || null,
    content: textToBlocks(parsed.data.body ?? "") as never,
    featured_image_url: imageUrl || null,
    seo_title: parsed.data.seoTitle || null,
    seo_description: parsed.data.seoDescription || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate(slug)
  return { success: true }
}

export async function updatePage(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)
  if (imageUrl === null) return { success: false, error: "Image must be a valid file under 10MB." }

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    parent_id: parsed.data.parentId || null,
    excerpt: parsed.data.excerpt || null,
    content: textToBlocks(parsed.data.body ?? "") as never,
    seo_title: parsed.data.seoTitle || null,
    seo_description: parsed.data.seoDescription || null,
    status: parsed.data.status,
  }
  if (imageUrl) update.featured_image_url = imageUrl

  const { data, error } = await supabase.from("margaret_pages").update(update as never).eq("id", parsed.data.id).select("slug").maybeSingle()
  if (error || !data) return { success: false, error: "You don't have permission to do this." }
  revalidate(data?.slug)
  return { success: true }
}

export async function deletePage(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_pages").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
