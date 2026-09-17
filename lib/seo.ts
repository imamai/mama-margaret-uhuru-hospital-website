import type { Metadata } from "next"

import type { SiteSettings } from "@/lib/data/settings"
import { parseMapCoords } from "@/lib/maps"

/** The live site. Used whenever the environment cannot be trusted. */
const PRODUCTION_URL = "https://mamamargaretuhuruhospital.co.ke"

const LOOPBACK = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i

/**
 * Canonical origin for every URL the site hands to a search engine.
 *
 * Two ways this has already gone wrong, both guarded here:
 *
 *  1. The variable is MISSING. The old fallback was http://localhost:3000, so a
 *     deploy without it told Google the hospital lives on a laptop. The
 *     fallback is now the live domain, which cannot be wrong that way.
 *
 *  2. The variable is SET, to localhost. A fallback cannot help with that --
 *     an explicit value wins -- and this is exactly what shipped: Search
 *     Console read all 60 sitemap URLs as "URL not allowed" because every one
 *     of them said http://localhost:3000. So in a production build a loopback
 *     address is now ignored outright. In development it is honoured, because
 *     there localhost is the right answer.
 *
 * Set NEXT_PUBLIC_SITE_URL properly regardless: preview deployments should
 * point at themselves, and only the environment knows their address.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "")
  if (!configured) return PRODUCTION_URL
  if (process.env.NODE_ENV === "production" && LOOPBACK.test(configured)) return PRODUCTION_URL
  return configured
}

export const SITE_URL = resolveSiteUrl()

/** Only this host is whitelisted for next/image and only it serves our uploads. */
const ASSET_HOST_PREFIX = "https://sedsjjmjnikppfaecaya.supabase.co/storage/v1/object/public/"

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Absolute URL for an image that may already be absolute. Social crawlers
 * reject relative image URLs outright, so every OG image goes through here.
 */
export function assetUrl(src?: string | null): string | null {
  if (!src) return null
  if (src.startsWith(ASSET_HOST_PREFIX)) return src
  if (/^https?:\/\//i.test(src)) return null // unknown host -- don't vouch for it
  return absoluteUrl(src)
}

/**
 * A phone number fit to publish in structured data.
 *
 * margaret_settings stores free text, and the ambulance line currently reads
 * "Coming soon". Schema.org telephone must be a dialable number or absent --
 * shipping prose there is how a hospital ends up with a Google listing that
 * dials nothing.
 */
export function dialableOrNull(value?: string | null): string | null {
  if (!value) return null
  const digits = value.replace(/[^\d]/g, "")
  return digits.length >= 9 ? value.trim() : null
}

/**
 * One page's complete metadata: title, description, canonical, Open Graph and
 * Twitter card.
 *
 * Next.js does not merge `openGraph` field by field with the parent. A page
 * that sets only `title` and `description` inherits the ROOT layout's Open
 * Graph block wholesale, so every department, doctor and article was being
 * shared on WhatsApp and Facebook under the homepage's title, description and
 * image. Building metadata here means the social card can never drift from the
 * page it belongs to.
 *
 * `title` is passed through the root layout's "%s | MMUH" template unless it
 * already names the hospital, in which case it is used verbatim -- an editor
 * writing an SEO title naturally includes the hospital's name, and the
 * template would otherwise brand it twice.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noindex = false,
}: {
  title: string
  description?: string | null
  path: string
  image?: string | null
  type?: "website" | "article"
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  noindex?: boolean
}): Metadata {
  const url = absoluteUrl(path)
  const ogImage = assetUrl(image)
  const desc = description?.trim() || undefined

  const lower = title.toLowerCase()
  const brandedTitle =
    lower.includes("mama margaret") || lower.includes("mmuh") ? title : `${title} | Mama Margaret Uhuru Hospital`

  return {
    title: { absolute: brandedTitle },
    description: desc,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type,
      url,
      siteName: "Mama Margaret Uhuru Hospital",
      locale: "en_KE",
      title: brandedTitle,
      description: desc,
      ...(ogImage ? { images: [{ url: ogImage, alt: brandedTitle }] } : {}),
      ...(type === "article"
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? publishedTime ?? undefined,
            authors,
          }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: brandedTitle,
      description: desc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

// ── Structured data ───────────────────────────────────────────────────────────
//
// Every builder below emits only what the hospital has actually told us, from
// margaret_settings and the CMS. Nothing here invents an accreditation, a bed
// count, a rating or an opening hour. For a hospital that is not pedantry:
// structured data is what Google shows a patient deciding where to take a sick
// child, and a confident-looking wrong answer is worse than a missing one.

const ORG_ID = `${SITE_URL}/#hospital`


/**
 * Splits the single free-text address into a PostalAddress. The stored value is
 * a street line followed by the city ("Outering Road, Off Kamunde Road
 * Nairobi"); previously the whole string was dropped into addressLocality,
 * which told Google the hospital is in a city of that name.
 */
function postalAddress(address: string) {
  const trimmed = address.trim()
  if (!trimmed) return { "@type": "PostalAddress", addressCountry: "KE" }

  const match = trimmed.match(/^(.*?)[\s,]+(Nairobi|Kiambu|Machakos|Kajiado)\s*$/i)
  return {
    "@type": "PostalAddress",
    ...(match ? { streetAddress: match[1].replace(/,\s*$/, "").trim(), addressLocality: match[2] } : { streetAddress: trimmed }),
    addressCountry: "KE",
  }
}

export function hospitalJsonLd(settings: SiteSettings, medicalSpecialties: string[] = []) {
  const sameAs = Object.values(settings.social_links ?? {}).filter((v): v is string => !!v && v.trim().length > 0)
  // The hospital's own map pin. Coordinates carry real weight in "hospital
  // near me" searches, and this is the one place the hospital has stated them.
  const geo = parseMapCoords(settings.google_maps_embed_url)
  const phones = [dialableOrNull(settings.general_phone), dialableOrNull(settings.emergency_phone)].filter(
    (v): v is string => !!v,
  )

  return {
    "@context": "https://schema.org",
    "@type": "Hospital",
    "@id": ORG_ID,
    name: settings.hospital_name,
    ...(settings.hospital_short_name ? { alternateName: settings.hospital_short_name } : {}),
    url: SITE_URL,
    ...(settings.logo_url ? { logo: settings.logo_url, image: settings.logo_url } : {}),
    ...(settings.mission ? { description: settings.mission } : {}),
    ...(phones.length ? { telephone: phones[0] } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    address: postalAddress(settings.address),
    ...(geo ? { geo: { "@type": "GeoCoordinates", ...geo } } : {}),
    ...(geo ? { hasMap: settings.google_maps_embed_url } : {}),
    areaServed: { "@type": "City", name: "Nairobi" },
    ...(medicalSpecialties.length ? { availableService: medicalSpecialties.map((name) => ({ "@type": "MedicalProcedure", name })) } : {}),
    ...(dialableOrNull(settings.emergency_phone)
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "emergency",
              telephone: settings.emergency_phone,
              areaServed: "KE",
              availableLanguage: ["en", "sw"],
            },
          ],
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    // Deliberately absent until the hospital confirms them: openingHours,
    // numberOfBeds, aggregateRating, isAcceptedBy (NHIF/insurers), and any
    // accreditation. See docs/seo.md.
  }
}

export function websiteJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: settings.hospital_name,
    url: SITE_URL,
    inLanguage: "en-KE",
    publisher: { "@id": ORG_ID },
    // No SearchAction: the site has no on-site search endpoint, and declaring
    // one that does not exist is the kind of structured data Google treats as
    // spam.
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function itemListJsonLd({ name, items }: { name: string; items: { name: string; path: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  }
}

/** A department or specialised clinic, as a unit of the hospital. */
export function medicalClinicJsonLd({
  name,
  description,
  path,
  image,
}: {
  name: string
  description?: string | null
  path: string
  image?: string | null
}) {
  const img = assetUrl(image)
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name,
    ...(description ? { description } : {}),
    ...(img ? { image: img } : {}),
    url: absoluteUrl(path),
    parentOrganization: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: "Nairobi" },
  }
}

/**
 * A named clinician. Only fields the hospital has published about its own staff
 * are emitted -- never an invented qualification, registration number or award.
 */
export function physicianJsonLd({
  name,
  specialization,
  description,
  path,
  image,
}: {
  name: string
  specialization?: string | null
  description?: string | null
  path: string
  image?: string | null
}) {
  const img = assetUrl(image)
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name,
    ...(specialization ? { medicalSpecialty: specialization } : {}),
    ...(description ? { description } : {}),
    ...(img ? { image: img } : {}),
    url: absoluteUrl(path),
    worksFor: { "@id": ORG_ID },
    affiliation: { "@id": ORG_ID },
  }
}

export function articleJsonLd({
  title,
  description,
  path,
  image,
  publishedAt,
  updatedAt,
  authorName,
}: {
  title: string
  description?: string | null
  path: string
  image?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  authorName?: string | null
}) {
  const img = assetUrl(image)
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description ? { description } : {}),
    ...(img ? { image: [img] } : {}),
    ...(authorName ? { author: { "@type": "Person", name: authorName } } : {}),
    publisher: { "@id": ORG_ID },
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(updatedAt || publishedAt ? { dateModified: updatedAt || publishedAt } : {}),
    mainEntityOfPage: absoluteUrl(path),
  }
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}
