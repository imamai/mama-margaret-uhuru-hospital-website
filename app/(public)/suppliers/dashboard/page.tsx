import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Calendar, LogOut } from "lucide-react"

import { TenderDocuments, type TenderDocument } from "@/components/forms/tender-documents"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { supplierSignOut } from "@/lib/actions/suppliers"
import { getCurrentSupplier } from "@/lib/data/suppliers"
import { getSiteSettings } from "@/lib/data/settings"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Supplier Dashboard" }

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Approval",
  approved: "Approved",
  rejected: "Registration Rejected",
  suspended: "Account Suspended",
}

export default async function SupplierDashboardPage() {
  const supplier = await getCurrentSupplier()
  if (!supplier) redirect("/suppliers/login")

  const supabase = await createClient()

  const [{ data: openTenders }, { data: myBids }] = await Promise.all([
    supplier.status === "approved"
      ? supabase
          .from("margaret_tenders")
          .select("id, title, slug, tender_number, closing_date")
          .eq("status", "published")
          .gt("closing_date", new Date().toISOString())
          .order("closing_date", { ascending: true })
      : Promise.resolve({ data: [] }),
    supabase.from("margaret_bids").select("tender_id, status").eq("supplier_id", supplier.id),
  ])

  const bidByTender = new Map((myBids ?? []).map((b) => [b.tender_id, b.status]))

  // Every document published with each open tender -- the ones to read and the
  // ones to fill in. Fetched once for all of them rather than per card.
  const tenderIds = (openTenders ?? []).map((t) => t.id as string)
  const [{ data: tenderDocs }, settings] = await Promise.all([
    tenderIds.length
      ? supabase
          .from("margaret_tender_documents")
          .select("id, tender_id, title, file_url, is_required_return, sort_order")
          .in("tender_id", tenderIds)
          .order("sort_order")
      : Promise.resolve({ data: [] }),
    getSiteSettings(),
  ])

  const docsByTender = new Map<string, TenderDocument[]>()
  for (const doc of tenderDocs ?? []) {
    const list = docsByTender.get(doc.tender_id as string) ?? []
    list.push({
      id: doc.id as string,
      title: doc.title as string,
      fileUrl: (doc.file_url as string | null) ?? null,
      mustReturn: Boolean(doc.is_required_return),
    })
    docsByTender.set(doc.tender_id as string, list)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{supplier.company_name}</h1>
          <p className="text-muted-foreground">{supplier.contact_person}</p>
        </div>
        <form action={supplierSignOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="size-4" aria-hidden="true" /> Sign Out
          </button>
        </form>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-2">
          <p className="text-sm text-muted-foreground">Registration status</p>
          <Badge variant={supplier.status === "approved" ? "default" : "outline"}>
            {STATUS_LABELS[supplier.status] ?? supplier.status}
          </Badge>
        </CardContent>
      </Card>

      {supplier.status === "pending" ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Your registration is awaiting review by our procurement team. You&rsquo;ll be able to download tender
          documents once approved.
        </p>
      ) : null}

      {supplier.status === "rejected" || supplier.status === "suspended" ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Please contact our procurement office for more information about your account.
        </p>
      ) : null}

      {supplier.status === "approved" ? (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Open Tenders</h2>
          {(openTenders ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">There are no open tenders at the moment.</p>
          ) : (
            <div className="space-y-4">
              {(openTenders ?? []).map((tender) => {
                const bidStatus = bidByTender.get(tender.id)
                return (
                  <Card key={tender.id}>
                    <CardContent className="flex flex-col justify-between gap-4 py-2 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">
                          {tender.tender_number}
                        </p>
                        <p className="font-semibold text-foreground">{tender.title}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="size-3.5" aria-hidden="true" />
                          Closes {new Date(tender.closing_date).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {bidStatus ? (
                          <Badge variant="secondary" className="w-fit capitalize">
                            Quotation {bidStatus.replace("_", " ")}
                          </Badge>
                        ) : null}
                        <TenderDocuments
                          tenderNumber={tender.tender_number}
                          tenderTitle={tender.title}
                          closingDate={tender.closing_date}
                          address={settings.address}
                          documents={docsByTender.get(tender.id) ?? []}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
