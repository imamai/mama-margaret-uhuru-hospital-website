import { SectionHeading } from "@/components/common/section-heading"
import { LogoMarquee } from "@/components/sections/logo-marquee"
import { PartnerLogo } from "@/components/sections/partner-logo"
import { getPartners } from "@/lib/data/homepage"

export async function PartnersSection() {
  const partners = await getPartners()
  if (partners.length === 0) return null

  return (
    <section aria-labelledby="partners-heading" className="mx-auto max-w-7xl py-16">
      <div className="px-4">
        <SectionHeading eyebrow="Working together" title="Our Partners" />
      </div>

      <div className="mt-8">
        <LogoMarquee
          seconds={45}
          items={partners.map((partner) => ({
            key: partner.id,
            node: (
              <PartnerLogo name={partner.name} logoUrl={partner.logo_url} websiteUrl={partner.website_url} />
            ),
          }))}
        />
      </div>
    </section>
  )
}
