import type { Metadata } from "next"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { listServiceCategories, listServices } from "@/lib/data/services"

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Services", description: "All medical services offered, categorized and searchable." }
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const [categories, services] = await Promise.all([listServiceCategories(), listServices(q)])

  const servicesByCategory = new Map<string, typeof services>()
  for (const service of services) {
    const key = service.category_id ?? "uncategorized"
    servicesByCategory.set(key, [...(servicesByCategory.get(key) ?? []), service])
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionHeading eyebrow="What we offer" title="Our Services" align="left" className="max-w-none" />

      <form className="mt-8 max-w-sm" action="/services" method="get">
        <Input type="search" name="q" placeholder="Search services" defaultValue={q ?? ""} aria-label="Search services" />
      </form>

      {services.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No services matched your search.</p>
      ) : (
        <div className="mt-10 space-y-10">
          {categories
            .filter((cat) => servicesByCategory.has(cat.id))
            .map((category) => (
              <section key={category.id}>
                <h2 className="mb-1 text-xl font-bold">{category.name}</h2>
                {category.description ? <p className="mb-4 text-sm text-muted-foreground">{category.description}</p> : null}
                <div className="grid gap-4 sm:grid-cols-2">
                  {(servicesByCategory.get(category.id) ?? []).map((service) => (
                    <Card key={service.id} className="overflow-hidden py-0">
                      <div className="relative h-32">
                        <SmartImage src={service.image_url} alt={service.name} kind="generic" />
                      </div>
                      <CardContent className="py-4">
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        {service.description ? (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                        ) : null}
                        {service.price_info ? (
                          <p className="mt-2 text-xs font-medium text-brand-deep dark:text-brand-accent">{service.price_info}</p>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  )
}
