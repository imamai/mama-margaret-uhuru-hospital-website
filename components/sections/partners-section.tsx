import { SectionHeading } from "@/components/common/section-heading"
import { PartnerLogo } from "@/components/sections/partner-logo"
import { getPartners } from "@/lib/data/homepage"

export async function PartnersSection() {
  const partners = await getPartners()
  if (partners.length === 0) return null

  return (
    <section aria-labelledby="partners-heading" className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Working together" title="Our Partners" />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {partners.map((partner) => (
          <PartnerLogo
            key={partner.id}
            name={partner.name}
            logoUrl={partner.logo_url}
            websiteUrl={partner.website_url}
          />
        ))}
      </div>
    </section>
  )
}
