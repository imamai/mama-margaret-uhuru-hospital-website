import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { BidRow } from "@/components/admin/bid-row"
import { ClarificationAnswerForm } from "@/components/admin/clarification-answer-form"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog } from "@/components/admin/entity-form-dialog"
import { TenderDocumentUploadForm } from "@/components/admin/tender-document-upload-form"
import { AddStandardFormsButton } from "@/components/admin/add-standard-forms-button"
import { AttachLibraryDocuments, type LibraryChoice } from "@/components/admin/attach-library-documents"
import { RecordBidForm } from "@/components/admin/record-bid-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteTenderDocument, recordTenderAward } from "@/lib/actions/admin/tenders"
import { createClient } from "@/lib/supabase/server"

export default async function AdminTenderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tender } = await supabase
    .from("margaret_tenders")
    .select("id, title, tender_number, closing_date, status")
    .eq("id", id)
    .maybeSingle()

  if (!tender) notFound()

  const [{ data: documents }, { data: clarifications }, { data: award }, { data: bids }] = await Promise.all([
    supabase.from("margaret_tender_documents").select("id, title, file_url, document_type, is_required_return, sort_order, library_document_id").eq("tender_id", id).order("sort_order").order("created_at"),
    supabase.from("margaret_tender_clarifications").select("id, question, answer, asked_by_name, status").eq("tender_id", id).order("created_at"),
    supabase.from("margaret_tender_awards").select("id, awarded_supplier_name").eq("tender_id", id).maybeSingle(),
    supabase
      .from("margaret_bids")
      .select("id, supplier_id, bid_amount, technical_score, financial_score, status")
      .eq("tender_id", id)
      .order("submitted_at", { ascending: false }),
  ])

  // The library shelf, and every approved supplier -- one for attaching
  // documents, the other for recording a quotation that arrived by envelope.
  const [{ data: libraryDocs }, { data: approvedSuppliers }] = await Promise.all([
    supabase
      .from("margaret_document_library")
      .select("id, title, description, category, sort_order")
      .is("deleted_at", null)
      .eq("status", "active")
      .order("category")
      .order("sort_order")
      .order("title"),
    supabase
      .from("margaret_suppliers")
      .select("id, company_name")
      .eq("status", "approved")
      .is("deleted_at", null)
      .order("company_name"),
  ])

  const attachedLibraryIds = new Set(
    (documents ?? []).map((d) => d.library_document_id as string | null).filter(Boolean) as string[]
  )
  const libraryChoices: LibraryChoice[] = (libraryDocs ?? []).map((doc) => ({
    id: doc.id as string,
    title: doc.title as string,
    description: (doc.description as string | null) ?? null,
    category: doc.category as string,
    attached: attachedLibraryIds.has(doc.id as string),
  }))

  const supplierIds = [...new Set((bids ?? []).map((b) => b.supplier_id))]
  const { data: suppliers } = supplierIds.length
    ? await supabase.from("margaret_suppliers").select("id, company_name").in("id", supplierIds)
    : { data: [] }
  const supplierNameById = new Map((suppliers ?? []).map((s) => [s.id, s.company_name]))

  const bidIds = (bids ?? []).map((b) => b.id)
  const { data: bidDocs } = bidIds.length
    ? await supabase
        .from("margaret_bid_documents")
        .select("id, bid_id, title, file_url, bucket, document_type, tender_document_id")
        .in("bid_id", bidIds)
    : { data: [] }

  // Files written before the bid-documents bucket existed still live in
  // tender-documents, which is why each row carries its own bucket.
  const docsByBid = new Map<string, { title: string; signedUrl: string | null }[]>()
  const returnedSlots = new Map<string, Set<string>>()

  for (const doc of bidDocs ?? []) {
    const { data: signed } = await supabase.storage
      .from((doc.bucket as string) ?? "tender-documents")
      .createSignedUrl(doc.file_url, 60 * 10)

    const list = docsByBid.get(doc.bid_id) ?? []
    list.push({
      title: (doc.document_type as string | null) ?? doc.title,
      signedUrl: signed?.signedUrl ?? null,
    })
    docsByBid.set(doc.bid_id, list)

    if (doc.tender_document_id) {
      const set = returnedSlots.get(doc.bid_id) ?? new Set<string>()
      set.add(doc.tender_document_id as string)
      returnedSlots.set(doc.bid_id, set)
    }
  }

  // What this tender asks to be signed and sent back, so a bid can be read as
  // complete or not without opening a single attachment.
  const requiredSlots = (documents ?? [])
    .filter((d) => d.is_required_return)
    .map((d) => ({ id: d.id as string, title: d.title as string }))

  const checklistByBid = new Map<string, { title: string; returned: boolean }[]>()
  for (const bid of bids ?? []) {
    const returned = returnedSlots.get(bid.id) ?? new Set<string>()
    checklistByBid.set(
      bid.id,
      requiredSlots.map((slot) => ({ title: slot.title, returned: returned.has(slot.id) })),
    )
  }

  return (
    <div>
      <Link href="/admin/tenders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to Tenders
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">{tender.tender_number}</p>
          <h1 className="text-2xl font-bold">{tender.title}</h1>
        </div>
        <Badge variant={tender.status === "published" ? "default" : "outline"}>{tender.status}</Badge>
      </div>

      <section className="mb-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Documents</h2>
            <p className="text-muted-foreground text-sm">
              {requiredSlots.length > 0
                ? `${requiredSlots.length} form${requiredSlots.length === 1 ? "" : "s"} must be signed and returned by every bidder.`
                : "No forms are marked for return, so bidders are only shown a plain file box."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AttachLibraryDocuments tenderId={tender.id} documents={libraryChoices} />
            <AddStandardFormsButton tenderId={tender.id} />
          </div>
        </div>
        <TenderDocumentUploadForm tenderId={tender.id} />
        <div className="mt-4 overflow-x-auto rounded-xl border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(documents ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                    No documents uploaded yet.
                  </TableCell>
                </TableRow>
              ) : (
                (documents ?? []).map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      {doc.file_url ? (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-brand-deep hover:underline dark:text-brand-accent">
                          {doc.title}
                        </a>
                      ) : (
                        <span>{doc.title}</span>
                      )}
                      {doc.is_required_return ? (
                        <span className="text-muted-foreground ml-2 text-xs">
                          must be returned{doc.file_url ? "" : " · no blank attached"}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{doc.document_type.replace("_", " ")}</TableCell>
                    <TableCell className="text-right">
                      <DeleteButton
                        id={doc.id}
                        action={deleteTenderDocument}
                        confirmMessage={`Delete "${doc.title}"?`}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">Clarifications</h2>
        {(clarifications ?? []).length === 0 ? (
          <p className="text-muted-foreground">No questions submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {(clarifications ?? []).map((c) => (
              <Card key={c.id}>
                <CardContent className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">Q: {c.question}</p>
                    <Badge variant={c.status === "published" ? "default" : "outline"}>{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">-- {c.asked_by_name}</p>
                  {c.answer ? (
                    <p className="mt-2 text-sm text-muted-foreground">A: {c.answer}</p>
                  ) : (
                    <ClarificationAnswerForm id={c.id} tenderId={tender.id} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Quotations received</h2>
            <p className="text-muted-foreground text-sm">
              Quotations arrive sealed and are opened in public. Record each one here after the opening.
            </p>
          </div>
          <RecordBidForm
            tenderId={tender.id}
            suppliers={(approvedSuppliers ?? []).map((sup) => ({
              id: sup.id as string,
              name: sup.company_name as string,
            }))}
          />
        </div>
        <div className="overflow-x-auto rounded-xl border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Scores</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(bids ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    Nothing recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                (bids ?? []).map((bid) => (
                  <BidRow
                    key={bid.id}
                    id={bid.id}
                    tenderId={tender.id}
                    supplierName={supplierNameById.get(bid.supplier_id) ?? "Unknown supplier"}
                    bidAmount={bid.bid_amount}
                    technicalScore={bid.technical_score}
                    financialScore={bid.financial_score}
                    status={bid.status}
                    documents={docsByBid.get(bid.id) ?? []}
                    checklist={checklistByBid.get(bid.id) ?? []}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Award</h2>
        {award ? (
          <Card>
            <CardContent className="py-2">
              <p className="text-sm text-foreground">
                Awarded to <span className="font-semibold">{award.awarded_supplier_name}</span>
              </p>
            </CardContent>
          </Card>
        ) : (
          <EntityFormDialog
            trigger={<Button size="sm">Record Award</Button>}
            title="Record Tender Award"
            fields={[
              { name: "awardedSupplierName", label: "Awarded supplier name", required: true },
              { name: "awardAmount", label: "Award amount (KES)", type: "number" },
              { name: "awardedAt", label: "Award date", type: "date", required: true },
            ]}
            action={recordTenderAward}
            hiddenFields={{ tenderId: tender.id }}
          />
        )}
      </section>
    </div>
  )
}
