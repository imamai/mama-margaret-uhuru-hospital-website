import type { Metadata } from "next"
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
import { VideoSection } from "@/components/sections/video-section"
import { getVisibleHomepageSections } from "@/lib/data/homepage"
import { getSiteSettings } from "@/lib/data/settings"
import { pageMetadata } from "@/lib/seo"

const SECTION_COMPONENTS: Record<string, () => Promise<JSX.Element | null>> = {
  emergency: EmergencyBanner,
  stats: StatsBar,
  departments: DepartmentsGrid,
  doctors: DoctorsGrid,
  clinics: ClinicsGrid,
  news: NewsGrid,
  events: EventsGrid,
  testimonials: TestimonialsCarousel,
  video: VideoSection,
  insurance: InsurancePartnersSection,
  gallery: GallerySection,
  awards: AwardsSection,
  partners: PartnersSection,
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return pageMetadata({
    title: settings.seo_defaults.title || `${settings.hospital_name} | Quality Healthcare in Nairobi, Kenya`,
    description:
      settings.seo_defaults.description ||
      `${settings.hospital_name} (MMUH) provides outpatient, maternity, paediatric, laboratory and emergency care on Outering Road, Nairobi. Book an appointment or call us today.`,
    path: "/",
    image: settings.seo_defaults.og_image || settings.logo_url,
  })
}

export default async function HomePage() {
  const [sections, settings] = await Promise.all([getVisibleHomepageSections(), getSiteSettings()])

  return (
    <>
      {/* The visible hero headline is a rotating carousel slide, so it cannot
          serve as the h1. This one is stable, names the hospital and says where
          it is -- the two things a patient searches for. It is read by screen
          readers and crawlers; sighted users see the carousel headline below. */}
      <h1 className="sr-only">
        {settings.hospital_name} ({settings.hospital_short_name}) — hospital in Nairobi, Kenya
      </h1>
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
