import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClinic, deleteClinic, updateClinic } from "@/lib/actions/admin/clinics"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; name: string; department_id: string | null; services: string[]; status: string }

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default async function AdminClinicsPage() {
  const supabase = await createClient()
  const [{ data }, { data: departments }] = await Promise.all([
    supabase
      .from("margaret_clinics")
      .select("id, name, department_id, services, status")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "name", label: "Name", required: true, defaultValue: row?.name },
      { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "services", label: "Services (comma separated)", defaultValue: row?.services?.join(", ") ?? "" },
      { name: "bannerImage", label: row ? "Replace banner image" : "Banner image", type: "file", accept: "image/*", hint: "Leave blank to keep the current image." },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.name.toLowerCase(),
    cells: [row.name, <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>],
    actions: (
      <div className="flex justify-end gap-1">
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit ${row.name}`}
          fields={fieldsFor(row)}
          action={updateClinic}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteClinic} confirmMessage={`Delete ${row.name}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clinics</h1>
          <p className="text-muted-foreground">Manage specialized clinics shown on the public site.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Clinic
            </Button>
          }
          title="New Clinic"
          fields={fieldsFor()}
          action={createClinic}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
