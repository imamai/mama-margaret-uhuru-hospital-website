import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { listDepartments } from "@/lib/data/departments"

export async function DepartmentsGrid() {
  const departments = await listDepartments()
  if (departments.length === 0) return null

  return (
    <section aria-labelledby="departments-heading" className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        eyebrow="Care areas"
        title="Our Departments"
        description="Specialised, multidisciplinary care across every stage of life."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {departments.slice(0, 6).map((department) => (
          <Card key={department.id} className="overflow-hidden py-0">
            <Link href={`/departments/${department.slug}`} className="group">
              <div className="relative h-40">
                <SmartImage src={department.banner_image_url} alt={department.name} kind="building" />
              </div>
              <CardContent className="py-5">
                <h3 className="font-semibold text-foreground group-hover:text-primary">{department.name}</h3>
                {department.description ? (
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{department.description}</p>
                ) : null}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/departments">
            View all departments <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
