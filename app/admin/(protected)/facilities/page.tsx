import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createFacility, deleteFacility, updateFacility } from "@/lib/actions/admin/facilities"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; name: string; facility_type: string; department_id: string | null; equipment: string[]; status: string }

const FACILITY_TYPE_OPTIONS = [
  { value: "operating_theatre", label: "Operating Theatre" },
  { value: "laboratory", label: "Laboratory" },
  { value: "radiology", label: "Radiology" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "maternity", label: "Maternity" },
  { value: "emergency", label: "Emergency" },
  { value: "general", label: "General" },
]

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default async function AdminFacilitiesPage() {
  const supabase = await createClient()
  const [{ data }, { data: departments }] = await Promise.all([
    supabase
      .from("margaret_facilities")
      .select("id, name, facility_type, department_id, equipment, status")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))
  const typeLabel = new Map(FACILITY_TYPE_OPTIONS.map((t) => [t.value, t.label]))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "name", label: "Name", required: true, defaultValue: row?.name },
      { name: "facilityType", label: "Type", type: "select", options: FACILITY_TYPE_OPTIONS, defaultValue: row?.facility_type ?? "general" },
      { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "equipment", label: "Equipment (comma separated)", defaultValue: row?.equipment?.join(", ") ?? "" },
      { name: "image", label: row ? "Replace image" : "Image", type: "file", accept: "image/*", hint: "Leave blank to keep the current image." },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.name.toLowerCase(),
    cells: [row.name, typeLabel.get(row.facility_type) ?? row.facility_type, <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>],
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
          action={updateFacility}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteFacility} confirmMessage={`Delete ${row.name}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Facilities</h1>
          <p className="text-muted-foreground">Manage operating theatres, labs, and other hospital facilities.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Facility
            </Button>
          }
          title="New Facility"
          fields={fieldsFor()}
          action={createFacility}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
