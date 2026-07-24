import { Award } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { Card, CardContent } from "@/components/ui/card"
import { getAwards } from "@/lib/data/homepage"

export async function AwardsSection() {
  const awards = await getAwards()
  if (awards.length === 0) return null

  return (
    <section aria-labelledby="awards-heading" className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Recognition" title="Awards & Accreditations" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award) => (
          <Card key={award.id}>
            <CardContent className="flex items-start gap-3 py-2">
              <Award className="mt-0.5 size-6 shrink-0 text-brand-deep dark:text-brand-accent" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground">{award.title}</h3>
                {award.awarding_body ? (
                  <p className="text-sm text-muted-foreground">
                    {award.awarding_body}
                    {award.awarded_year ? ` · ${award.awarded_year}` : ""}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
