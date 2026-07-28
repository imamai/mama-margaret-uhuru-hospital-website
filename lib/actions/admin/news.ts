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
  categoryId: z.string().uuid().optional().or(z.literal("")),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  body: z.string().trim().max(20000).optional().or(z.literal("")),
  authorName: z.string().trim().max(200).optional().or(z.literal("")),
  tags: z.string().trim().max(500).optional().or(z.literal("")),
  isFeatured: z.enum(["true", "false"]).default("false"),
  isBreaking: z.enum(["true", "false"]).default("false"),
  publishedAt: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    categoryId: formData.get("categoryId") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    body: formData.get("body") ?? "",
    authorName: formData.get("authorName") ?? "",
    tags: formData.get("tags") ?? "",
    isFeatured: formData.get("isFeatured") === "true" ? "true" : "false",
    isBreaking: formData.get("isBreaking") === "true" ? "true" : "false",
    publishedAt: formData.get("publishedAt") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function toList(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean)
}

function revalidate(slug?: string) {
  revalidatePath("/admin/news")
  revalidatePath("/news")
  if (slug) revalidatePath(`/news/${slug}`)
}

async function maybeUploadImage(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("featuredImage")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (!file.type.startsWith("image/")) return null
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "gallery", "news", file)
}

export async function createNews(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)
  const slug = slugify(parsed.data.title)

  const { error } = await supabase.from("margaret_news").insert({
    title: parsed.data.title,
    slug,
    category_id: parsed.data.categoryId || null,
    excerpt: parsed.data.excerpt || null,
    content: textToBlocks(parsed.data.body ?? "") as never,
    featured_image_url: imageUrl || null,
    author_name: parsed.data.authorName || null,
    tags: toList(parsed.data.tags ?? ""),
    is_featured: parsed.data.isFeatured === "true",
    is_breaking: parsed.data.isBreaking === "true",
    published_at: parsed.data.publishedAt || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate(slug)
  return { success: true }
}

export async function updateNews(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)
  if (imageUrl === null) return { success: false, error: "Image must be a valid file under 10MB." }

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    category_id: parsed.data.categoryId || null,
    excerpt: parsed.data.excerpt || null,
    content: textToBlocks(parsed.data.body ?? "") as never,
    author_name: parsed.data.authorName || null,
    tags: toList(parsed.data.tags ?? ""),
    is_featured: parsed.data.isFeatured === "true",
    is_breaking: parsed.data.isBreaking === "true",
    published_at: parsed.data.publishedAt || null,
    status: parsed.data.status,
  }
  if (imageUrl) update.featured_image_url = imageUrl

  const { data, error } = await supabase.from("margaret_news").update(update as never).eq("id", parsed.data.id).select("slug").maybeSingle()
  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate(data?.slug)
  return { success: true }
}

export async function deleteNews(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_news").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
