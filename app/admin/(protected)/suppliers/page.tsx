import { Badge } from "@/components/ui/badge"
import { StatusSelect } from "@/components/admin/status-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { updateSupplierStatus } from "@/lib/actions/admin/suppliers"
import { createClient } from "@/lib/supabase/server"

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
] as const

export default async function AdminSuppliersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_suppliers")
    .select("id, company_name, contact_person, email, phone, status")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  const suppliers = data ?? []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <p className="text-muted-foreground">Review and approve supplier registrations for the tenders portal.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Change Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No supplier registrations yet.
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium text-foreground">{supplier.company_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{supplier.contact_person}</div>
                    <div>{supplier.email}</div>
                    <div>{supplier.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "approved" ? "default" : "outline"}>{supplier.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <StatusSelect
                      value={supplier.status as (typeof STATUS_OPTIONS)[number]["value"]}
                      options={STATUS_OPTIONS as unknown as { value: string; label: string }[]}
                      onChange={(next) => updateSupplierStatus(supplier.id, next as (typeof STATUS_OPTIONS)[number]["value"])}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
