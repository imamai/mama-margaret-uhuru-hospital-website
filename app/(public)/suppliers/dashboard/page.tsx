import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Calendar, LogOut } from "lucide-react"

import { BidForm } from "@/components/forms/bid-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { supplierSignOut } from "@/lib/actions/suppliers"
import { getCurrentSupplier } from "@/lib/data/suppliers"
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
          Your registration is awaiting review by our procurement team. You&rsquo;ll be able to submit bids once
          approved.
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
                      {bidStatus ? (
                        <Badge variant="secondary" className="w-fit capitalize">
                          Bid {bidStatus.replace("_", " ")}
                        </Badge>
                      ) : (
                        <BidForm tenderId={tender.id} tenderTitle={tender.title} />
                      )}
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
