import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, Download, Mail, MapPin, Phone } from "lucide-react"

import { SmartImage } from "@/components/common/smart-image"
import { Card, CardContent } from "@/components/ui/card"
import { getDepartmentBySlug } from "@/lib/data/departments"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const department = await getDepartmentBySlug(slug)
  if (!department) return {}

  return {
    title: department.seo_title || department.name,
    description: department.seo_description || department.description || undefined,
  }
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const department = await getDepartmentBySlug(slug)
  if (!department) notFound()

  const operatingHours = department.operating_hours as Record<string, string> | null

  return (
    <div>
      <div className="relative h-56 sm:h-72">
        <SmartImage src={department.banner_image_url} alt={department.name} kind="building" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{department.name}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {department.description ? (
            <section>
              <h2 className="mb-3 text-xl font-bold">About this department</h2>
              <p className="whitespace-pre-line text-muted-foreground">{department.description}</p>
            </section>
          ) : null}

          {department.services.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xl font-bold">Services</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {department.services.map((service) => (
                  <Card key={service.id} className="overflow-hidden py-0">
                    <div className="relative h-32">
                      <SmartImage src={service.image_url} alt={service.name} kind="generic" />
                    </div>
                    <CardContent className="py-4">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      {service.description ? (
                        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{service.description}</p>
                      ) : null}
                      {service.price_info ? (
                        <p className="mt-2 text-xs font-medium text-brand-deep dark:text-brand-accent">
                          {service.price_info}
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          {department.doctors.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xl font-bold">Doctors in this department</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {department.doctors.map((doctor) => (
                  <Link
                    key={doctor.id}
                    href={`/doctors/${doctor.slug}`}
                    className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
                      <SmartImage src={doctor.photo_url} alt={doctor.full_name} kind="doctor" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doctor.full_name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {department.gallery.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xl font-bold">Gallery</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {department.gallery.map((item) => (
                  <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg">
                    <SmartImage src={item.thumbnail_url ?? item.file_url} alt={item.caption ?? item.title ?? department.name} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {department.downloads.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xl font-bold">Downloads</h2>
              <ul className="space-y-2">
                {department.downloads.map((file) => (
                  <li key={file.id}>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Download className="size-4" aria-hidden="true" />
                      {file.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-3 py-2">
              <h2 className="font-semibold text-foreground">Contact & Hours</h2>
              {department.location ? (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {department.location}
                </p>
              ) : null}
              {department.phone ? (
                <a href={`tel:${department.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Phone className="size-4 shrink-0" aria-hidden="true" /> {department.phone}
                </a>
              ) : null}
              {department.email ? (
                <a href={`mailto:${department.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Mail className="size-4 shrink-0" aria-hidden="true" /> {department.email}
                </a>
              ) : null}
              {operatingHours && Object.keys(operatingHours).length > 0 ? (
                <div className="border-t pt-3">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Clock className="size-4" aria-hidden="true" /> Operating Hours
                  </p>
                  <dl className="space-y-1 text-sm text-muted-foreground">
                    {Object.entries(operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between gap-4">
                        <dt className="capitalize">{day}</dt>
                        <dd>{hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
