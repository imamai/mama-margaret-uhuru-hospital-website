import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { VideoNoScriptLink, VideoPlayer } from "@/components/sections/video-player"
import { JsonLd } from "@/components/seo/json-ld"
import { Button } from "@/components/ui/button"
import { getFeaturedVideo, listMedia } from "@/lib/data/media"
import { youTubeEmbedUrl, youTubeThumbnails, youTubeWatchUrl } from "@/lib/video"

/**
 * The hospital's featured video, on the homepage.
 *
 * Reads the same library as /media -- whichever video sorts first in Admin >
 * Gallery is the one shown here. One place to manage photos and videos, so the
 * homepage can never quietly disagree with the media page.
 *
 * Renders nothing when there is no playable video, so an empty library leaves
 * the homepage looking finished rather than showing a broken player.
 */
export async function VideoSection() {
  const [video, all] = await Promise.all([getFeaturedVideo(), listMedia()])
  if (!video) return null

  const title = video.title || "Watch"
  const hasMore = all.length > 1

  return (
    <section aria-labelledby="video-heading" className="mx-auto max-w-5xl px-4 py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: title,
          ...(video.caption ? { description: video.caption } : {}),
          thumbnailUrl: [video.thumbnail_url || youTubeThumbnails(video.youTubeId).fallback],
          embedUrl: youTubeEmbedUrl(video.youTubeId),
          url: youTubeWatchUrl(video.youTubeId),
        }}
      />

      <SectionHeading eyebrow="Watch" title={title} description={video.caption ?? undefined} />

      <div className="mt-10 aspect-video overflow-hidden rounded-2xl border bg-muted">
        <VideoPlayer id={video.youTubeId} title={title} />
      </div>

      <VideoNoScriptLink id={video.youTubeId} title={title} />

      {hasMore ? (
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/media">
              See all photos and videos <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : null}
    </section>
  )
}
