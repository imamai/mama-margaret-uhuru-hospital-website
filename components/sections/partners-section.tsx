import { SectionHeading } from "@/components/common/section-heading"
import { getPartners } from "@/lib/data/homepage"

export async function PartnersSection() {
  const partners = await getPartners()
  if (partners.length === 0) return null

  return (
    <section aria-labelledby="partners-heading" className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Working together" title="Our Partners" />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {partners.map((partner) =>
          partner.website_url ? (
            <a
              key={partner.id}
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {partner.name}
            </a>
          ) : (
            <span key={partner.id} className="text-base font-semibold text-muted-foreground">
              {partner.name}
            </span>
          )
        )}
      </div>
    </section>
  )
}
