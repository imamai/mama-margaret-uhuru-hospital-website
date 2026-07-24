import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Award, Calendar, Download, HelpCircle } from "lucide-react"

import { ClarificationForm } from "@/components/forms/clarification-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getTenderBySlug, isTenderOpen } from "@/lib/data/tenders"

const DOCUMENT_LABELS: Record<string, string> = {
  tender_document: "Tender Document",
  addendum: "Addendum",
  clarification: "Clarification",
  opening_result: "Opening Result",
  award_notice: "Award Notice",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tender = await getTenderBySlug(slug)
  if (!tender) return {}
  return {
    title: `${tender.tender_number} -- ${tender.title}`,
    description: tender.description?.slice(0, 160),
  }
}

export default async function TenderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tender = await getTenderBySlug(slug)
  if (!tender) notFound()

  const open = isTenderOpen(tender.closing_date)

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={open ? "default" : "outline"}>{open ? "Open" : "Closed"}</Badge>
        <p className="text-sm font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">
          {tender.tender_number}
        </p>
      </div>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{tender.title}</h1>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-4" aria-hidden="true" />
          Closes {new Date(tender.closing_date).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}
        </span>
        {tender.opening_date ? (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" aria-hidden="true" />
            Opens {new Date(tender.opening_date).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}
          </span>
        ) : null}
      </div>

      <div className="mt-10 space-y-8">
        {tender.description ? (
          <section>
            <h2 className="mb-2 text-lg font-bold">Description</h2>
            <p className="whitespace-pre-line text-muted-foreground">{tender.description}</p>
          </section>
        ) : null}

        {tender.eligibility ? (
          <section>
            <h2 className="mb-2 text-lg font-bold">Eligibility</h2>
            <p className="whitespace-pre-line text-muted-foreground">{tender.eligibility}</p>
          </section>
        ) : null}

        {tender.documents.length > 0 ? (
          <section>
            <h2 className="mb-3 text-lg font-bold">Documents</h2>
            <ul className="space-y-2">
              {tender.documents.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    {doc.title}
                    <Badge variant="secondary" className="ml-auto">
                      {DOCUMENT_LABELS[doc.document_type] ?? doc.document_type}
                    </Badge>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tender.award ? (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Award className="size-5" aria-hidden="true" /> Award Notice
            </h2>
            <Card>
              <CardContent className="py-2 text-sm">
                <p className="font-semibold text-foreground">{tender.award.awarded_supplier_name}</p>
                {tender.award.award_amount ? (
                  <p className="text-muted-foreground">Amount: KES {Number(tender.award.award_amount).toLocaleString()}</p>
                ) : null}
                {tender.award.awarded_at ? (
                  <p className="text-muted-foreground">
                    Awarded {new Date(tender.award.awarded_at).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                  </p>
                ) : null}
                {tender.award.award_notice_url ? (
                  <a
                    href={tender.award.award_notice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-brand-deep hover:underline dark:text-brand-accent"
                  >
                    View award notice
                  </a>
                ) : null}
              </CardContent>
            </Card>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <HelpCircle className="size-5" aria-hidden="true" /> Clarifications
          </h2>
          {tender.clarifications.length > 0 ? (
            <div className="mb-6 space-y-4">
              {tender.clarifications.map((c) => (
                <Card key={c.id}>
                  <CardContent className="space-y-1.5 py-2 text-sm">
                    <p className="font-semibold text-foreground">Q: {c.question}</p>
                    {c.answer ? <p className="text-muted-foreground">A: {c.answer}</p> : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="mb-6 text-sm text-muted-foreground">No clarifications published yet.</p>
          )}

          {open ? (
            <Card>
              <CardContent className="py-2">
                <p className="mb-4 text-sm text-muted-foreground">Have a question about this tender? Ask below.</p>
                <ClarificationForm tenderId={tender.id} tenderSlug={tender.slug} />
              </CardContent>
            </Card>
          ) : null}
        </section>

        {open ? (
          <Card className="bg-muted/40">
            <CardContent className="flex flex-col items-start gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Registered and approved suppliers can submit a bid for this tender.</p>
              <Button asChild size="sm">
                <Link href="/suppliers/login">Log in to Submit a Bid</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
