import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Card, CardContent } from "@/components/ui/card"
import { listClinics } from "@/lib/data/clinics"

export async function ClinicsGrid() {
  const clinics = await listClinics()
  if (clinics.length === 0) return null

  return (
    <section aria-labelledby="clinics-heading" className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Specialised care" title="Specialized Clinics" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clinics.map((clinic) => (
          <Card key={clinic.id} className="overflow-hidden py-0">
            <div className="relative h-36">
              <SmartImage src={clinic.banner_image_url} alt={clinic.name} kind="building" />
            </div>
            <CardContent className="py-5">
              <h3 className="font-semibold text-foreground">{clinic.name}</h3>
              {clinic.description ? (
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{clinic.description}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
