import { FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SupplierStatusSelect } from "@/components/admin/supplier-status-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"

export default async function AdminSuppliersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_suppliers")
    .select("id, company_name, contact_person, email, phone, status")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  const suppliers = data ?? []

  const { data: documents } =
    suppliers.length > 0
      ? await supabase
          .from("margaret_supplier_documents")
          .select("id, supplier_id, title, file_url")
          .in("supplier_id", suppliers.map((s) => s.id))
      : { data: [] }

  const documentsBySupplier = new Map<string, { id: string; title: string; signedUrl: string | null }[]>()
  for (const doc of documents ?? []) {
    const { data: signed } = await supabase.storage.from("supplier-documents").createSignedUrl(doc.file_url, 60 * 10)
    const list = documentsBySupplier.get(doc.supplier_id) ?? []
    list.push({ id: doc.id, title: doc.title, signedUrl: signed?.signedUrl ?? null })
    documentsBySupplier.set(doc.supplier_id, list)
  }

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
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Change Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
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
                  <TableCell className="text-sm">
                    {(documentsBySupplier.get(supplier.id) ?? []).length === 0 ? (
                      <span className="text-muted-foreground">None</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {(documentsBySupplier.get(supplier.id) ?? []).map((doc) =>
                          doc.signedUrl ? (
                            <a
                              key={doc.id}
                              href={doc.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-brand-deep hover:underline dark:text-brand-accent"
                            >
                              <FileText className="size-3.5" aria-hidden="true" /> {doc.title}
                            </a>
                          ) : (
                            <span key={doc.id} className="text-muted-foreground">
                              {doc.title} (unavailable)
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "approved" ? "default" : "outline"}>{supplier.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <SupplierStatusSelect id={supplier.id} status={supplier.status} />
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
