import type { Metadata } from "next"
import Link from "next/link"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Card, CardContent } from "@/components/ui/card"
import { listClinics } from "@/lib/data/clinics"

export const metadata: Metadata = {
  title: "Specialized Clinics",
  description: "Explore our specialized outpatient clinics.",
}

export default async function ClinicsPage() {
  const clinics = await listClinics()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Specialised care" title="Specialized Clinics" align="left" className="max-w-none" />

      {clinics.length === 0 ? (
        <p className="mt-10 text-muted-foreground">Clinic information is being updated. Please check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="overflow-hidden py-0">
              <Link href={`/clinics/${clinic.slug}`} className="group">
                <div className="relative h-40">
                  <SmartImage src={clinic.banner_image_url} alt={clinic.name} kind="building" />
                </div>
                <CardContent className="py-5">
                  <h2 className="font-semibold text-foreground group-hover:text-primary">{clinic.name}</h2>
                  {clinic.description ? (
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{clinic.description}</p>
                  ) : null}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
