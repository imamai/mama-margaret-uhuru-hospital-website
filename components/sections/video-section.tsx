import { SectionHeading } from "@/components/common/section-heading"
import { VideoNoScriptLink, VideoPlayer } from "@/components/sections/video-player"
import { JsonLd } from "@/components/seo/json-ld"
import { getSiteSettings } from "@/lib/data/settings"
import { youTubeEmbedUrl, youTubeThumbnails, youTubeWatchUrl } from "@/lib/video"
import { youTubeId } from "@/lib/video"

/**
 * The hospital's video, on the homepage.
 *
 * Renders nothing unless Settings holds a link we can actually read, so an
 * empty or mistyped field leaves the page looking finished rather than showing
 * a broken player. Managed like every other homepage section -- reorder or
 * hide it from Admin > Homepage Builder.
 */
export async function VideoSection() {
  const settings = await getSiteSettings()
  const { url, title, description } = settings.homepage_video

  const id = youTubeId(url)
  if (!id) return null

  const heading = title.trim() || "Watch"

  return (
    <section aria-labelledby="video-heading" className="mx-auto max-w-5xl px-4 py-16">
      {/* VideoObject tells Google there is a video here and what it shows,
          which is what makes a thumbnail eligible to appear beside the search
          result. Only fields we genuinely have are emitted. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: heading,
          ...(description.trim() ? { description: description.trim() } : {}),
          thumbnailUrl: [youTubeThumbnails(id).fallback],
          embedUrl: youTubeEmbedUrl(id),
          url: youTubeWatchUrl(id),
        }}
      />

      <SectionHeading eyebrow="Watch" title={heading} description={description.trim() || undefined} />

      <div className="mt-10 aspect-video overflow-hidden rounded-2xl border bg-muted">
        <VideoPlayer id={id} title={heading} />
      </div>

      <VideoNoScriptLink id={id} title={heading} />
    </section>
  )
}
