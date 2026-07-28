import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { listDoctors } from "@/lib/data/doctors"

export async function DoctorsGrid() {
  const doctors = await listDoctors()
  if (doctors.length === 0) return null

  return (
    <section aria-labelledby="doctors-heading" className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="Meet our team" title="Our Doctors" description="Experienced specialists dedicated to your wellbeing." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.slice(0, 8).map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden py-0 text-center">
              <Link href={`/doctors/${doctor.slug}`} className="group">
                <div className="relative aspect-square bg-muted">
                  <SmartImage src={doctor.photo_url} alt={doctor.full_name} kind="doctor" className="object-contain" />
                </div>
                <CardContent className="py-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary">{doctor.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/doctors">
              View all doctors <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
