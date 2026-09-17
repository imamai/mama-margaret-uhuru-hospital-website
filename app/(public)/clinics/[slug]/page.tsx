import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, ListChecks } from "lucide-react"

import { SmartImage } from "@/components/common/smart-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getClinicBySlug } from "@/lib/data/clinics"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { medicalClinicJsonLd, pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const clinic = await getClinicBySlug(slug)
  if (!clinic) return { title: "Clinic not found", robots: { index: false, follow: false } }
  return pageMetadata({
    title: clinic.seo_title || `${clinic.name} in Nairobi`,
    description:
      clinic.seo_description ||
      clinic.description ||
      `The ${clinic.name} at Mama Margaret Uhuru Hospital, Outering Road, Nairobi — clinic days, services and how to book.`,
    path: `/clinics/${clinic.slug}`,
    image: clinic.banner_image_url,
  })
}

export default async function ClinicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const clinic = await getClinicBySlug(slug)
  if (!clinic) notFound()

  const operatingHours = clinic.operating_hours as Record<string, string> | null

  return (
    <div>
      <JsonLd
        data={medicalClinicJsonLd({
          name: clinic.name,
          description: clinic.description,
          path: `/clinics/${clinic.slug}`,
          image: clinic.banner_image_url,
        })}
      />
      <div className="relative h-56 sm:h-72 lg:h-[26rem]">
        <SmartImage src={clinic.banner_image_url} alt={clinic.name} kind="building" sizes="100vw" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-6">
            <Breadcrumbs
              onDark
              items={[
                { name: "Clinics", path: "/clinics" },
                { name: clinic.name, path: `/clinics/${clinic.slug}` },
              ]}
            />
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{clinic.name}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {clinic.description ? (
            <section>
              <h2 className="mb-3 text-xl font-bold">About this clinic</h2>
              <p className="whitespace-pre-line text-muted-foreground">{clinic.description}</p>
            </section>
          ) : null}

          {clinic.services.length > 0 ? (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
                <ListChecks className="size-5" aria-hidden="true" /> Services
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {clinic.services.map((service) => (
                  <li key={service} className="rounded-lg border px-4 py-2.5 text-sm text-foreground">
                    {service}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {clinic.department ? (
            <Button asChild variant="outline">
              <Link href={`/departments/${clinic.department.slug}`}>Visit {clinic.department.name} Department</Link>
            </Button>
          ) : null}
        </div>

        <aside>
          {operatingHours && Object.keys(operatingHours).length > 0 ? (
            <Card>
              <CardContent className="space-y-3 py-2">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <Clock className="size-4" aria-hidden="true" /> Operating Hours
                </p>
                <dl className="space-y-1 text-sm text-muted-foreground">
                  {Object.entries(operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between gap-4">
                      <dt className="capitalize">{day.replace(/_/g, " ")}</dt>
                      <dd>{hours}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
