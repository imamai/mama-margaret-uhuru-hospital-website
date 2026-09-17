import { SectionHeading } from "@/components/common/section-heading"
import { PartnerLogo } from "@/components/sections/partner-logo"
import { getInsurancePartners } from "@/lib/data/homepage"

export async function InsurancePartnersSection() {
  const partners = await getInsurancePartners()
  if (partners.length === 0) return null

  return (
    <section aria-labelledby="insurance-heading" className="border-y bg-muted/40 py-14">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="We accept" title="Insurance Partners" />
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
      </div>
    </section>
  )
}
