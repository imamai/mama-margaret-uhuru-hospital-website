import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createResearch, deleteResearch, updateResearch } from "@/lib/actions/admin/research"
import { createClient } from "@/lib/supabase/server"

type Row = {
  id: string
  title: string
  authors: string[]
  doctor_id: string | null
  department_id: string | null
  publication_url: string | null
  published_year: number | null
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default async function AdminResearchPage() {
  const supabase = await createClient()
  const [{ data }, { data: doctors }, { data: departments }] = await Promise.all([
    supabase
      .from("margaret_research")
      .select("id, title, authors, doctor_id, department_id, publication_url, published_year, status")
      .is("deleted_at", null)
      .order("published_year", { ascending: false, nullsFirst: false }),
    supabase.from("margaret_doctors").select("id, full_name").is("deleted_at", null).order("full_name"),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const doctorOptions = (doctors ?? []).map((d) => ({ value: d.id, label: d.full_name }))
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "title", label: "Title", required: true, defaultValue: row?.title },
      { name: "abstract", label: "Abstract", type: "textarea" },
      { name: "authors", label: "Authors (comma separated)", defaultValue: row?.authors?.join(", ") ?? "" },
      { name: "doctorId", label: "Doctor", type: "select", options: [{ value: "", label: "None" }, ...doctorOptions], defaultValue: row?.doctor_id ?? "" },
      { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
      { name: "publicationUrl", label: "Publication URL", defaultValue: row?.publication_url ?? "" },
      { name: "file", label: row ? "Replace attachment" : "Attachment (PDF)", type: "file", accept: ".pdf,application/pdf" },
      { name: "publishedYear", label: "Published year", type: "number", defaultValue: row?.published_year ? String(row.published_year) : undefined },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "year", label: "Year" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.title.toLowerCase(),
    cells: [row.title, row.published_year ? String(row.published_year) : "—", <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>],
    actions: (
      <div className="flex justify-end gap-1">
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit ${row.title}`}
          fields={fieldsFor(row)}
          action={updateResearch}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteResearch} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Research</h1>
          <p className="text-muted-foreground">Manage published research and academic papers.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Publication
            </Button>
          }
          title="New Research Publication"
          fields={fieldsFor()}
          action={createResearch}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
