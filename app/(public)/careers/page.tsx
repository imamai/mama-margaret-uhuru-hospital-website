import type { Metadata } from "next"
import Link from "next/link"
import { Briefcase, Calendar, MapPin } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { listOpenJobs } from "@/lib/data/jobs"

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore current job openings and join our team.",
}

export default async function CareersPage() {
  const jobs = await listOpenJobs()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionHeading
        eyebrow="Join our team"
        title="Careers"
        description="We're always looking for compassionate, skilled professionals."
        align="left"
        className="max-w-none"
      />

      {jobs.length === 0 ? (
        <p className="mt-10 text-muted-foreground">There are no open positions at the moment. Please check back soon.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="flex flex-col justify-between gap-4 py-2 sm:flex-row sm:items-center">
                <div>
                  <Link href={`/careers/${job.slug}`} className="font-semibold text-foreground hover:text-primary">
                    {job.title}
                  </Link>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" aria-hidden="true" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="size-3.5" aria-hidden="true" /> {job.contract_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" aria-hidden="true" /> Closes{" "}
                      {new Date(job.application_deadline).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {job.positions_available} {job.positions_available === 1 ? "position" : "positions"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
