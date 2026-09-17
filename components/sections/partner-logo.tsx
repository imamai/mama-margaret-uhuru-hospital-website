import Image from "next/image"

/**
 * One entry in a row of partner or insurer logos.
 *
 * Both sections used to fetch logo_url and then print only the name, so a logo
 * uploaded in the admin was stored, served, and never shown. This shows the
 * logo when there is one and falls back to the name when there is not, so a row
 * can mix the two while the hospital is still collecting logos.
 *
 * The name stays as the image's alt text: a logo is how a sighted visitor
 * recognises SHA, but it says nothing to a screen reader.
 */
export function PartnerLogo({
  name,
  logoUrl,
  websiteUrl,
}: {
  name: string
  logoUrl: string | null
  websiteUrl: string | null
}) {
  const mark = logoUrl ? (
    <span className="flex h-16 w-40 items-center justify-center">
      <Image
        src={logoUrl}
        alt={name}
        width={160}
        height={64}
        sizes="160px"
        className="max-h-16 w-auto object-contain"
      />
    </span>
  ) : (
    <span className="text-base font-semibold text-muted-foreground">{name}</span>
  )

  if (!websiteUrl) return <span title={name}>{mark}</span>

  return (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      className="rounded transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {mark}
    </a>
  )
}
