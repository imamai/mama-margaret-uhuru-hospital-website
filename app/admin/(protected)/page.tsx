import Link from "next/link"
import { Briefcase, Building2, Stethoscope } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { listDepartments } from "@/lib/data/departments"
import { listDoctors } from "@/lib/data/doctors"
import { listOpenJobs } from "@/lib/data/jobs"

export default async function AdminDashboardPage() {
  const [departments, doctors, jobs] = await Promise.all([
    listDepartments(),
    listDoctors(),
    listOpenJobs(),
  ])

  const cards = [
    { label: "Departments", value: departments.length, href: "/admin/departments", icon: Building2 },
    { label: "Doctors", value: doctors.length, href: "/admin/doctors", icon: Stethoscope },
    { label: "Open Positions", value: jobs.length, href: "/admin/jobs", icon: Briefcase },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage published content across the website.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 py-2">
                <card.icon className="size-8 text-brand-deep dark:text-brand-accent" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Additional modules (Tenders, News, Events, Research, Settings, Roles &amp; Permissions, and more) are on the
        implementation roadmap -- see <code className="rounded bg-muted px-1.5 py-0.5">ROADMAP.md</code>.
      </p>
    </div>
  )
}
