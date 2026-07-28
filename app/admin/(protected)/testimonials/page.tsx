import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createTestimonial, deleteTestimonial, updateTestimonial } from "@/lib/actions/admin/testimonials"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; patient_name: string; quote: string; rating: number | null; department_id: string | null; status: string }

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()
  const [{ data }, { data: departments }] = await Promise.all([
    supabase
      .from("margaret_testimonials")
      .select("id, patient_name, quote, rating, department_id, status")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "patientName", label: "Patient name", required: true, defaultValue: row?.patient_name },
      { name: "quote", label: "Quote", type: "textarea", required: true, defaultValue: row?.quote },
      { name: "rating", label: "Rating (1-5)", type: "number", defaultValue: row?.rating ? String(row.rating) : undefined },
      { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
      { name: "photo", label: row ? "Replace photo" : "Photo", type: "file", accept: "image/*" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "patient_name", label: "Patient" },
    { key: "quote", label: "Quote" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.patient_name.toLowerCase(),
    cells: [row.patient_name, <span key="quote" className="line-clamp-2 max-w-xs text-sm text-muted-foreground">{row.quote}</span>, <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>],
    actions: (
      <div className="flex justify-end gap-1">
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit testimonial from ${row.patient_name}`}
          fields={fieldsFor(row)}
          action={updateTestimonial}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteTestimonial} confirmMessage={`Delete this testimonial?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage patient testimonials shown on the homepage.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Testimonial
            </Button>
          }
          title="New Testimonial"
          fields={fieldsFor()}
          action={createTestimonial}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
