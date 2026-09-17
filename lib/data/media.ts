import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"
import { youTubeId } from "@/lib/video"

export type MediaItem = {
  id: string
  title: string | null
  media_type: string
  file_url: string
  thumbnail_url: string | null
  caption: string | null
}

/**
 * Everything published in margaret_gallery, newest ordering first by sort_order.
 *
 * One library backs both the /media page and the homepage's video section, so
 * an administrator adds a photo or a video in exactly one place -- Admin >
 * Gallery -- and it appears wherever it belongs.
 */
export const listMedia = cache(async (): Promise<MediaItem[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_gallery")
    .select("id, title, media_type, file_url, thumbnail_url, caption")
    .is("deleted_at", null)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
})

/** Published videos, only those we can actually play. */
export const listVideos = cache(async (): Promise<(MediaItem & { youTubeId: string })[]> => {
  const items = await listMedia()
  return items
    .filter((item) => item.media_type === "video")
    .map((item) => ({ ...item, youTubeId: youTubeId(item.file_url) ?? "" }))
    .filter((item) => item.youTubeId !== "")
})

export const listPhotos = cache(async (): Promise<MediaItem[]> => {
  const items = await listMedia()
  return items.filter((item) => item.media_type === "image")
})

/** The one shown on the homepage: whichever video sorts first. */
export const getFeaturedVideo = cache(async () => {
  const videos = await listVideos()
  return videos[0] ?? null
})
