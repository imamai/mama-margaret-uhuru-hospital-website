/**
 * Turning whatever an administrator pasted into something a browser will frame.
 *
 * Google serves two different kinds of Maps URL:
 *
 *   https://www.google.com/maps/place/...   the link you get from "Share".
 *                                           Sent with X-Frame-Options:
 *                                           SAMEORIGIN, so a browser refuses
 *                                           to render it in an iframe at all
 *                                           -- you get an empty grey box.
 *
 *   https://www.google.com/maps/embed?pb=   the one behind "Share > Embed a
 *                                           map". No framing header, works.
 *
 * Settings asks for an "embed URL", but the Share link is what anyone
 * naturally copies, and that is what was saved -- which is why the Contact
 * page showed a broken tile. Rather than expecting whoever edits the site to
 * know the difference, we recognise the ordinary link and convert it.
 */

/**
 * The coordinates Google encodes in a Maps URL.
 *
 * Prefers the `!3d<lat>!4d<lng>` pair, which is the resolved place, over the
 * `@lat,lng` viewport centre, which is only where the camera happened to sit
 * when the link was copied.
 */
export function parseMapCoords(url?: string | null): { latitude: number; longitude: number } | null {
  if (!url) return null
  const place = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
  const source = place ?? url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (!source) return null
  const latitude = Number(source[1])
  const longitude = Number(source[2])
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null
  return { latitude, longitude }
}

/**
 * An embeddable map URL, or null if we cannot make one.
 *
 * Returning null matters: a null renders a link to Google Maps instead, which
 * is useful, where a broken iframe is just a grey box with a sad icon. Never
 * guess a location — a hospital sending a patient to the wrong pin is worse
 * than a hospital showing no map.
 */
export function toMapEmbedUrl(url?: string | null): string | null {
  const raw = url?.trim()
  if (!raw) return null
  if (!/^https?:\/\//i.test(raw)) return null

  // Already an embed URL (or the Maps Embed API) -- pass it through untouched.
  if (/\/maps\/embed/i.test(raw)) return raw

  // `output=embed` is Google's own shorthand: it 301s to /maps/embed, and
  // browsers follow redirects inside an iframe.
  if (/[?&]output=embed\b/i.test(raw)) return raw

  const coords = parseMapCoords(raw)
  if (coords) {
    return `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}&z=17&output=embed`
  }

  return null
}
