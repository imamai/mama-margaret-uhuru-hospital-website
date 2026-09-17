import type { Metadata } from "next"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { VideoPlayer } from "@/components/sections/video-player"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { listPhotos, listVideos } from "@/lib/data/media"
import { getSiteSettings } from "@/lib/data/settings"
import { absoluteUrl, pageMetadata } from "@/lib/seo"
import { youTubeEmbedUrl, youTubeThumbnails, youTubeWatchUrl } from "@/lib/video"

export const metadata: Metadata = pageMetadata({
  title: "Photos & Videos",
  description:
    "Photos and videos from around Mama Margaret Uhuru Hospital in Nairobi — our facilities, departments and hospital events.",
  path: "/media",
})

export default async function MediaPage() {
  const [videos, photos, settings] = await Promise.all([listVideos(), listPhotos(), getSiteSettings()])

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <Breadcrumbs items={[{ name: "Photos & Videos", path: "/media" }]} />

      <div className="mt-6">
        <SectionHeading
          as="h1"
          eyebrow="Media"
          title="Photos & Videos"
          description={`A look around ${settings.hospital_name} — our facilities, our departments and the events we host.`}
          align="left"
          className="max-w-none"
        />
      </div>

      {videos.length === 0 && photos.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          Photos and videos are being added. Please check back soon.
        </p>
      ) : null}

      {videos.length > 0 ? (
        <section aria-labelledby="videos-heading" className="mt-12">
          <h2 id="videos-heading" className="text-xl font-bold">
            Videos
          </h2>

          {/* One VideoObject per video, so each is eligible for a thumbnail
              beside a search result. Only fields we genuinely hold are sent. */}
          {videos.map((video) => (
            <JsonLd
              key={`ld-${video.id}`}
              data={{
                "@context": "https://schema.org",
                "@type": "VideoObject",
                name: video.title || "Hospital video",
                ...(video.caption ? { description: video.caption } : {}),
                thumbnailUrl: [video.thumbnail_url || youTubeThumbnails(video.youTubeId).fallback],
                embedUrl: youTubeEmbedUrl(video.youTubeId),
                url: youTubeWatchUrl(video.youTubeId),
                ...(absoluteUrl("/media") ? { mainEntityOfPage: absoluteUrl("/media") } : {}),
              }}
            />
          ))}

          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {videos.map((video) => (
              <figure key={video.id}>
                <div className="aspect-video overflow-hidden rounded-2xl border bg-muted">
                  <VideoPlayer id={video.youTubeId} title={video.title || "Hospital video"} />
                </div>
                {video.title || video.caption ? (
                  <figcaption className="mt-3">
                    {video.title ? <p className="font-semibold">{video.title}</p> : null}
                    {video.caption ? <p className="text-sm text-muted-foreground">{video.caption}</p> : null}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {photos.length > 0 ? (
        <section aria-labelledby="photos-heading" className="mt-16">
          <h2 id="photos-heading" className="text-xl font-bold">
            Photos
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <figure key={photo.id}>
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <SmartImage
                    src={photo.thumbnail_url ?? photo.file_url}
                    alt={photo.caption ?? photo.title ?? `${settings.hospital_name} gallery photograph`}
                  />
                </div>
                {photo.caption ? (
                  <figcaption className="mt-2 text-xs text-muted-foreground">{photo.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
