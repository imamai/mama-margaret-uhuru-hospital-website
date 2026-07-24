import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, FileText } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { isTenderOpen, listTenders } from "@/lib/data/tenders"

export const metadata: Metadata = {
  title: "Tenders",
  description: "Current and past procurement tenders and RFQs.",
}

export default async function TendersPage() {
  const tenders = await listTenders()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionHeading eyebrow="Procurement" title="Tenders" align="left" className="max-w-none" />

      {tenders.length === 0 ? (
        <p className="mt-10 text-muted-foreground">There are no published tenders at the moment.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {tenders.map((tender) => {
            const open = isTenderOpen(tender.closing_date)
            return (
              <Card key={tender.id}>
                <CardContent className="flex flex-col justify-between gap-4 py-2 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">
                      {tender.tender_number}
                    </p>
                    <Link href={`/tenders/${tender.slug}`} className="font-semibold text-foreground hover:text-primary">
                      {tender.title}
                    </Link>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      Closes {new Date(tender.closing_date).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <Badge variant={open ? "default" : "outline"} className="w-fit">
                    {open ? "Open" : "Closed"}
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3 border-t pt-8">
        <Link
          href="/suppliers/register"
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <FileText className="size-4" aria-hidden="true" /> Register as a Supplier
        </Link>
        <Link
          href="/suppliers/login"
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Supplier Login
        </Link>
      </div>
    </div>
  )
}
