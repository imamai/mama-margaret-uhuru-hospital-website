import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createService, deleteService, updateService } from "@/lib/actions/admin/services"
import { createClient } from "@/lib/supabase/server"

type Row = {
  id: string
  name: string
  category_id: string | null
  department_id: string | null
  price_info: string | null
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default async function AdminServicesPage() {
  const supabase = await createClient()
  const [{ data }, { data: categories }, { data: departments }] = await Promise.all([
    supabase
      .from("margaret_services")
      .select("id, name, category_id, department_id, price_info, status")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("margaret_service_categories").select("id, name").order("name"),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }))
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))
  const categoryName = new Map((categories ?? []).map((c) => [c.id, c.name]))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "name", label: "Name", required: true, defaultValue: row?.name },
      { name: "categoryId", label: "Category", type: "select", options: [{ value: "", label: "None" }, ...categoryOptions], defaultValue: row?.category_id ?? "" },
      { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "priceInfo", label: "Price info", defaultValue: row?.price_info ?? "" },
      { name: "image", label: row ? "Replace image" : "Image", type: "file", accept: "image/*", hint: "Leave blank to keep the current image." },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.name.toLowerCase(),
    cells: [
      row.name,
      row.category_id ? (categoryName.get(row.category_id) ?? "—") : "—",
      <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>,
    ],
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
          action={updateService}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteService} confirmMessage={`Delete ${row.name}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage clinical and diagnostic services shown on the public site.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Service
            </Button>
          }
          title="New Service"
          fields={fieldsFor()}
          action={createService}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
