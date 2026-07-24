import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Briefcase, Calendar, MapPin } from "lucide-react"

import { JobApplicationForm } from "@/components/forms/job-application-form"
import { Card, CardContent } from "@/components/ui/card"
import { getJobBySlug, isJobOpen } from "@/lib/data/jobs"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) return {}
  return {
    title: job.title,
    description: job.description?.slice(0, 160),
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) notFound()

  const open = isJobOpen(job.application_deadline)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">
        {job.department?.name ?? "Mama Margaret Uhuru Hospital"}
      </p>
      <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{job.title}</h1>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden="true" /> {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="size-4" aria-hidden="true" /> {job.contract_type}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="size-4" aria-hidden="true" /> Closes{" "}
          {new Date(job.application_deadline).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      <div className="mt-8 space-y-8">
        {job.description ? (
          <section>
            <h2 className="mb-2 text-lg font-bold">Overview</h2>
            <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
          </section>
        ) : null}
        {job.responsibilities ? (
          <section>
            <h2 className="mb-2 text-lg font-bold">Responsibilities</h2>
            <p className="whitespace-pre-line text-muted-foreground">{job.responsibilities}</p>
          </section>
        ) : null}
        {job.qualifications ? (
          <section>
            <h2 className="mb-2 text-lg font-bold">Qualifications</h2>
            <p className="whitespace-pre-line text-muted-foreground">{job.qualifications}</p>
          </section>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {job.experience_required ? (
            <p className="text-sm">
              <span className="font-semibold text-foreground">Experience: </span>
              <span className="text-muted-foreground">{job.experience_required}</span>
            </p>
          ) : null}
          {job.salary_range ? (
            <p className="text-sm">
              <span className="font-semibold text-foreground">Salary: </span>
              <span className="text-muted-foreground">{job.salary_range}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="mb-6 text-xl font-bold">Apply for this position</h2>
        {open ? (
          <JobApplicationForm jobId={job.id} />
        ) : (
          <Card>
            <CardContent className="py-2 text-muted-foreground">
              The application deadline for this position has passed.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
