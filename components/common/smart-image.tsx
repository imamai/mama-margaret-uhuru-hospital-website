import Image from "next/image"

import { PlaceholderImage } from "@/components/common/placeholder-image"
import { cn } from "@/lib/utils"

/**
 * Renders a real photo when a *_url column is populated, otherwise falls
 * back to a branded placeholder. Centralising the null-check here means
 * every grid/card only has to pass the raw (possibly null) url.
 */
export function SmartImage({
  src,
  alt,
  kind = "generic",
  className,
  sizes,
  fill = true,
}: {
  src: string | null | undefined
  alt: string
  kind?: "building" | "doctor" | "people" | "generic"
  className?: string
  sizes?: string
  fill?: boolean
}) {
  if (!src) {
    return <PlaceholderImage kind={kind} label={alt} className={className} />
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "(min-width: 1024px) 33vw, 100vw"}
      className={cn("object-cover", className)}
    />
  )
}
