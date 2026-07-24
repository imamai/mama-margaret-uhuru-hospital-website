import type { Metadata } from "next"
import Link from "next/link"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { listDoctors } from "@/lib/data/doctors"
import { getSiteSettings } from "@/lib/data/settings"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: "Our Doctors",
    description: `Meet the specialists and consultants at ${settings.hospital_name}.`,
  }
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const doctors = await listDoctors(q)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        eyebrow="Meet our team"
        title="Our Doctors"
        description="Experienced specialists dedicated to your wellbeing."
        align="left"
        className="max-w-none"
      />

      <form className="mt-8 max-w-sm" action="/doctors" method="get">
        <Input type="search" name="q" placeholder="Search by name or specialty" defaultValue={q ?? ""} aria-label="Search doctors" />
      </form>

      {doctors.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No doctors matched your search.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden py-0 text-center">
              <Link href={`/doctors/${doctor.slug}`} className="group">
                <div className="relative aspect-square">
                  <SmartImage src={doctor.photo_url} alt={doctor.full_name} kind="doctor" />
                </div>
                <CardContent className="py-4">
                  <h2 className="font-semibold text-foreground group-hover:text-primary">{doctor.full_name}</h2>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  {doctor.years_experience ? (
                    <p className="mt-1 text-xs text-muted-foreground">{doctor.years_experience}+ years experience</p>
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
