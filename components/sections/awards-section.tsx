import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
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
          <Card key={award.id} className="overflow-hidden py-0">
            <div className="relative h-32">
              <SmartImage src={award.image_url} alt={award.title} kind="award" />
            </div>
            <CardContent className="py-4">
              <h3 className="font-semibold text-foreground">{award.title}</h3>
              {award.awarding_body ? (
                <p className="text-sm text-muted-foreground">
                  {award.awarding_body}
                  {award.awarded_year ? ` · ${award.awarded_year}` : ""}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
