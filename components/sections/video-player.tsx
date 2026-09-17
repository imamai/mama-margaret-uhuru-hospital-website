"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

import { youTubeEmbedUrl, youTubeThumbnails, youTubeWatchUrl } from "@/lib/video"

/**
 * A YouTube video that costs nothing until someone chooses to watch it.
 *
 * The obvious implementation drops YouTube's iframe straight into the page.
 * That pulls roughly a megabyte of player code, on every visit, for every
 * visitor, whether or not anyone presses play -- and sets YouTube's cookies
 * for all of them. On a hospital homepage that is the wrong trade twice over:
 * many patients are on metered mobile data, and nobody should be enrolled in
 * ad tracking for reading about a clinic.
 *
 * So this renders the poster frame and a play button, roughly thirty
 * kilobytes, and swaps in the real player on the first click.
 */
export function VideoPlayer({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const thumbnails = youTubeThumbnails(id)
  const [poster, setPoster] = useState(thumbnails.best)

  if (playing) {
    return (
      <iframe
        src={youTubeEmbedUrl(id, { autoplay: true })}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative h-full w-full cursor-pointer"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 60rem, 100vw"
        className="object-cover"
        // maxresdefault does not exist for videos uploaded below 720p; hqdefault
        // always does.
        onError={() => setPoster(thumbnails.fallback)}
      />
      <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110 sm:size-20">
          <Play className="ml-1 size-7 fill-brand-deep text-brand-deep sm:size-9" aria-hidden="true" />
        </span>
      </span>
      <span className="sr-only">Play video: {title}</span>
    </button>
  )
}

/**
 * Shown only when JavaScript has not run. Without it the poster is a button
 * that does nothing, which is a dead end -- this at least gets the visitor to
 * the video.
 */
export function VideoNoScriptLink({ id, title }: { id: string; title: string }) {
  return (
    <noscript>
      <a href={youTubeWatchUrl(id)} target="_blank" rel="noopener noreferrer" className="underline">
        Watch “{title}” on YouTube
      </a>
    </noscript>
  )
}
