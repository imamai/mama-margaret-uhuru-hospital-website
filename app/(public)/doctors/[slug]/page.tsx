import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Award, Clock, GraduationCap, Languages, Mail, Phone } from "lucide-react"

import { LinkedInIcon, TwitterIcon } from "@/components/common/social-icons"
import { SmartImage } from "@/components/common/smart-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getDoctorBySlug } from "@/lib/data/doctors"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doctor = await getDoctorBySlug(slug)
  if (!doctor) return {}
  return {
    title: doctor.full_name,
    description: doctor.biography || `${doctor.full_name}, ${doctor.specialization}`,
  }
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doctor = await getDoctorBySlug(slug)
  if (!doctor) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <SmartImage src={doctor.photo_url} alt={doctor.full_name} kind="doctor" className="object-contain" />
          </div>
          <div className="mt-6 space-y-2">
            {doctor.phone ? (
              <a href={`tel:${doctor.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Phone className="size-4" aria-hidden="true" /> {doctor.phone}
              </a>
            ) : null}
            {doctor.email ? (
              <a href={`mailto:${doctor.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Mail className="size-4" aria-hidden="true" /> {doctor.email}
              </a>
            ) : null}
            <div className="flex gap-2 pt-2">
              {doctor.linkedin_url ? (
                <a href={doctor.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full bg-muted p-2 hover:bg-muted/70">
                  <LinkedInIcon className="size-4" />
                </a>
              ) : null}
              {doctor.twitter_url ? (
                <a href={doctor.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="rounded-full bg-muted p-2 hover:bg-muted/70">
                  <TwitterIcon className="size-4" />
                </a>
              ) : null}
            </div>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/appointments">Book with {doctor.full_name.split(" ")[0]}</Link>
          </Button>
        </div>

        <div className="space-y-8 lg:col-span-2">
          <div>
            <p className="text-sm font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">
              {doctor.department?.name ?? doctor.specialization}
            </p>
            <h1 className="mt-1 text-3xl font-bold">{doctor.full_name}</h1>
            <p className="mt-1 text-muted-foreground">{doctor.title ? `${doctor.title} · ` : ""}{doctor.specialization}</p>
          </div>

          {doctor.biography ? (
            <section>
              <h2 className="mb-2 text-lg font-bold">Biography</h2>
              <p className="whitespace-pre-line text-muted-foreground">{doctor.biography}</p>
            </section>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2">
            {doctor.qualifications.length > 0 ? (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <GraduationCap className="size-4" aria-hidden="true" /> Qualifications
                </h2>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {doctor.qualifications.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {doctor.languages.length > 0 ? (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Languages className="size-4" aria-hidden="true" /> Languages
                </h2>
                <p className="text-sm text-muted-foreground">{doctor.languages.join(", ")}</p>
              </section>
            ) : null}
          </div>

          {doctor.availability.length > 0 ? (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Clock className="size-4" aria-hidden="true" /> Availability
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {doctor.availability.map((slot) => (
                  <Card key={slot.id}>
                    <CardContent className="flex items-center justify-between py-2 text-sm">
                      <span className="font-medium text-foreground">{DAYS[slot.day_of_week]}</span>
                      <span className="text-muted-foreground">
                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                        {slot.location ? ` · ${slot.location}` : ""}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          {doctor.publications.length > 0 ? (
            <section>
              <h2 className="mb-3 text-lg font-bold">Research & Publications</h2>
              <ul className="space-y-2">
                {doctor.publications.map((pub) => (
                  <li key={pub.id} className="text-sm">
                    {pub.publication_url ? (
                      <a href={pub.publication_url} target="_blank" rel="noopener noreferrer" className="text-brand-deep hover:underline dark:text-brand-accent">
                        {pub.title}
                      </a>
                    ) : (
                      <span>{pub.title}</span>
                    )}
                    {pub.published_year ? <span className="text-muted-foreground"> ({pub.published_year})</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {doctor.awards.length > 0 ? (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Award className="size-4" aria-hidden="true" /> Awards
              </h2>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {doctor.awards.map((award) => (
                  <li key={award.id}>
                    {award.title}
                    {award.awarding_body ? ` — ${award.awarding_body}` : ""}
                    {award.awarded_year ? ` (${award.awarded_year})` : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
