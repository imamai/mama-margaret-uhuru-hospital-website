import type { Metadata } from "next"
import Link from "next/link"
import { CalendarPlus, Download, LogIn } from "lucide-react"

import { BlockContent } from "@/components/common/block-content"
import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { FeedbackForm } from "@/components/forms/feedback-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getPageBySlug } from "@/lib/data/pages"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("patients")
  return {
    title: page?.seo_title || "Patient Information",
    description: page?.seo_description || "Admissions, discharge, billing, insurance, and patient rights.",
  }
}

export default async function PatientsPage() {
  const page = await getPageBySlug("patients")

  return (
    <div>
      <div className="relative h-48 sm:h-64">
        <SmartImage src={page?.featured_image_url} alt={page?.title ?? "Patient Information"} kind="people" />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <SectionHeading eyebrow="Patients" title={page?.title ?? "Patient Information"} align="left" className="max-w-none" />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Button asChild size="lg">
            <Link href="/appointments">
              <CalendarPlus className="size-4" aria-hidden="true" /> Book Appointment
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#feedback">Give Feedback</a>
          </Button>
          <Button asChild size="lg" variant="outline" disabled>
            <span className="pointer-events-none opacity-60">
              <LogIn className="size-4" aria-hidden="true" /> Patient Portal (Coming Soon)
            </span>
          </Button>
        </div>

        <div className="mt-10">
          {page ? (
            <BlockContent content={page.content} />
          ) : (
            <p className="text-muted-foreground">Patient information is being updated. Please check back soon.</p>
          )}
        </div>

        {page && page.downloads.length > 0 ? (
          <div className="mt-10 border-t pt-8">
            <h2 className="mb-4 text-lg font-bold">Download Forms</h2>
            <ul className="space-y-2">
              {page.downloads.map((file) => (
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
          </div>
        ) : null}

        <Card id="feedback" className="mt-10 scroll-mt-24">
          <CardContent className="py-2">
            <h2 className="mb-1 text-lg font-bold">Patient Feedback</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Tell us about your experience -- your feedback helps us improve.
            </p>
            <FeedbackForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
