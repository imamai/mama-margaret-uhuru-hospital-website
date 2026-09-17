"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import type { ActionResult } from "@/lib/actions/forms"
import { youTubeId, youTubeThumbnails } from "@/lib/video"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().max(200).optional().or(z.literal("")),
  mediaType: z.enum(["image", "video"]),
  videoUrl: z.string().trim().max(500).optional().or(z.literal("")),
  caption: z.string().trim().max(500).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title") ?? "",
    mediaType: formData.get("mediaType") ?? "image",
    videoUrl: formData.get("videoUrl") ?? "",
    caption: formData.get("caption") ?? "",
    status: formData.get("status") ?? "published",
  })
}

function revalidate() {
  revalidatePath("/admin/gallery")
  revalidatePath("/media")
  revalidatePath("/")
}

/**
 * Where a gallery item's media actually comes from.
 *
 * A photo is uploaded. A video is usually a YouTube link, because hospital
 * video runs to tens of minutes and the upload limit here is 10MB -- the
 * opening-ceremony video is an hour and a half. So for a video item a link is
 * accepted in place of a file, and its poster frame comes from YouTube.
 *
 * Returns an error string, or the columns to write.
 */
function resolveMedia(
  mediaType: "image" | "video",
  videoUrl: string,
): { error: string } | { fileUrl: string; thumbnailUrl: string | null } {
  const id = youTubeId(videoUrl)
  if (!id) {
    return {
      error:
        "That does not look like a YouTube link. Paste the address from the video's page, e.g. https://www.youtube.com/watch?v=…",
    }
  }
  if (mediaType !== "video") {
    return { error: "A YouTube link can only be used for a video. Choose Video as the media type, or upload a file." }
  }
  return { fileUrl: videoUrl.trim(), thumbnailUrl: youTubeThumbnails(id).fallback }
}

export async function createGalleryItem(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const videoUrl = parsed.data.videoUrl || ""

  let fileUrl: string
  let thumbnailUrl: string | null = null

  if (videoUrl) {
    const resolved = resolveMedia(parsed.data.mediaType, videoUrl)
    if ("error" in resolved) return { success: false, error: resolved.error }
    fileUrl = resolved.fileUrl
    thumbnailUrl = resolved.thumbnailUrl
  } else {
    const file = formData.get("file")
    if (!(file instanceof File) || file.size === 0) {
      return {
        success: false,
        error:
          parsed.data.mediaType === "video"
            ? "Paste a YouTube link, or upload a video file under 10MB."
            : "Please choose a file.",
      }
    }
    if (file.size > MAX_UPLOAD_BYTES) return { success: false, error: "File must be smaller than 10MB." }
    const uploaded = await uploadPublicFile(supabase, "gallery", "items", file)
    if (!uploaded) return { success: false, error: "You don't have permission to upload files." }
    fileUrl = uploaded
  }

  const { error } = await supabase.from("margaret_gallery").insert({
    title: parsed.data.title || null,
    media_type: parsed.data.mediaType,
    file_url: fileUrl,
    thumbnail_url: thumbnailUrl,
    caption: parsed.data.caption || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateGalleryItem(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()

  const update: Record<string, unknown> = {
    title: parsed.data.title || null,
    media_type: parsed.data.mediaType,
    caption: parsed.data.caption || null,
    status: parsed.data.status,
  }

  const videoUrl = parsed.data.videoUrl || ""
  const file = formData.get("file")

  if (videoUrl) {
    const resolved = resolveMedia(parsed.data.mediaType, videoUrl)
    if ("error" in resolved) return { success: false, error: resolved.error }
    update.file_url = resolved.fileUrl
    update.thumbnail_url = resolved.thumbnailUrl
  } else if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) return { success: false, error: "File must be smaller than 10MB." }
    const uploaded = await uploadPublicFile(supabase, "gallery", "items", file)
    if (!uploaded) return { success: false, error: "You don't have permission to upload files." }
    update.file_url = uploaded
    update.thumbnail_url = null
  }

  const { data, error } = await supabase.from("margaret_gallery").update(update as never).eq("id", parsed.data.id).select("id")
  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_gallery").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
