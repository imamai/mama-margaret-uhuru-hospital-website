import type { JSX } from "react"

import { AwardsSection } from "@/components/sections/awards-section"
import { ClinicsGrid } from "@/components/sections/clinics-grid"
import { DepartmentsGrid } from "@/components/sections/departments-grid"
import { DoctorsGrid } from "@/components/sections/doctors-grid"
import { EmergencyBanner } from "@/components/sections/emergency-banner"
import { EventsGrid } from "@/components/sections/events-grid"
import { GallerySection } from "@/components/sections/gallery-section"
import { Hero } from "@/components/sections/hero"
import { InsurancePartnersSection } from "@/components/sections/insurance-partners"
import { NewsGrid } from "@/components/sections/news-grid"
import { PartnersSection } from "@/components/sections/partners-section"
import { StatsBar } from "@/components/sections/stats-bar"
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel"
import { getVisibleHomepageSections } from "@/lib/data/homepage"
import { getSiteSettings } from "@/lib/data/settings"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const SECTION_COMPONENTS: Record<string, () => Promise<JSX.Element | null>> = {
  emergency: EmergencyBanner,
  stats: StatsBar,
  departments: DepartmentsGrid,
  doctors: DoctorsGrid,
  clinics: ClinicsGrid,
  news: NewsGrid,
  events: EventsGrid,
  testimonials: TestimonialsCarousel,
  insurance: InsurancePartnersSection,
  gallery: GallerySection,
  awards: AwardsSection,
  partners: PartnersSection,
}

export default async function HomePage() {
  const [sections, settings] = await Promise.all([getVisibleHomepageSections(), getSiteSettings()])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: settings.hospital_name,
    url: SITE_URL,
    logo: settings.logo_url || undefined,
    telephone: settings.emergency_phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.address,
    },
    sameAs: Object.values(settings.social_links).filter(Boolean),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero always renders first regardless of homepage_sections ordering --
          it's the one section every hospital homepage in the reference set leads with. */}
      <Hero />
      {sections
        .filter((section) => section.section_key !== "hero")
        .map((section) => {
          const Component = SECTION_COMPONENTS[section.section_key]
          if (!Component) return null
          return <Component key={section.id} />
        })}
    </>
  )
}
