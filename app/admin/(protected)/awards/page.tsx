import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createAward, deleteAward, updateAward } from "@/lib/actions/admin/awards"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; title: string; awarding_body: string | null; department_id: string | null; awarded_year: number | null; status: string }

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default async function AdminAwardsPage() {
  const supabase = await createClient()
  const [{ data }, { data: departments }] = await Promise.all([
    supabase
      .from("margaret_awards")
      .select("id, title, awarding_body, department_id, awarded_year, status")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "title", label: "Title", required: true, defaultValue: row?.title },
      { name: "awardingBody", label: "Awarding body", defaultValue: row?.awarding_body ?? "" },
      { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "awardedYear", label: "Year awarded", type: "number", defaultValue: row?.awarded_year ? String(row.awarded_year) : undefined },
      { name: "image", label: row ? "Replace image" : "Image", type: "image" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "published" },
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
    cells: [row.title, row.awarded_year ? String(row.awarded_year) : "—", <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>],
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
          action={updateAward}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteAward} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Awards</h1>
          <p className="text-muted-foreground">Manage hospital and staff awards shown on the public site.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Award
            </Button>
          }
          title="New Award"
          fields={fieldsFor()}
          action={createAward}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
