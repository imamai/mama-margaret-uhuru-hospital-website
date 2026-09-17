/**
 * Reading a YouTube link the way someone actually copies one.
 *
 * A person pasting a video into Settings will paste whatever the address bar
 * or the Share button gave them, and YouTube has at least five shapes for the
 * same video. Rather than demanding one, we pull the id out of any of them.
 */

/** YouTube ids are exactly eleven characters of this alphabet. */
const ID = /^[A-Za-z0-9_-]{11}$/

const PATH_FORMS = [
  /^\/embed\/([A-Za-z0-9_-]{11})/, // /embed/ID          (already an embed)
  /^\/shorts\/([A-Za-z0-9_-]{11})/, // /shorts/ID
  /^\/live\/([A-Za-z0-9_-]{11})/, // /live/ID
  /^\/v\/([A-Za-z0-9_-]{11})/, // /v/ID              (very old form)
]

/**
 * The video id, or null if this is not a YouTube link we recognise.
 *
 * Returning null matters: the section renders nothing at all rather than an
 * empty player, so a mistyped link leaves the homepage looking finished
 * instead of broken.
 */
export function youTubeId(url?: string | null): string | null {
  const raw = url?.trim()
  if (!raw) return null

  // A bare id is a reasonable thing to paste, so accept it.
  if (ID.test(raw)) return raw

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase()

  // youtu.be/ID
  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/")[0]
    return ID.test(id) ? id : null
  }

  if (host !== "youtube.com" && host !== "m.youtube.com" && host !== "youtube-nocookie.com") {
    return null
  }

  // youtube.com/watch?v=ID
  const v = parsed.searchParams.get("v")
  if (v && ID.test(v)) return v

  for (const form of PATH_FORMS) {
    const match = parsed.pathname.match(form)
    if (match) return match[1]
  }

  return null
}

/**
 * The player URL, on the no-cookie host.
 *
 * youtube-nocookie.com does not set tracking cookies until the visitor plays
 * the video. On a hospital site that is the right default: someone reading
 * about a diagnosis should not be enrolled in ad tracking for doing so.
 */
export function youTubeEmbedUrl(id: string, { autoplay = false } = {}): string {
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" })
  if (autoplay) params.set("autoplay", "1")
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}

/** Where a human goes to watch it, for the no-JavaScript fallback. */
export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}

/**
 * Poster frames, best first.
 *
 * `maxresdefault` only exists for videos uploaded above 720p, so the caller
 * falls back to `hqdefault`, which YouTube generates for every video.
 */
export function youTubeThumbnails(id: string): { best: string; fallback: string } {
  return {
    best: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    fallback: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  }
}
