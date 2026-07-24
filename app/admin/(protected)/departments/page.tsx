import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createDepartment, deleteDepartment, updateDepartment } from "@/lib/actions/admin/departments"
import { createClient } from "@/lib/supabase/server"

type DepartmentRow = {
  id: string
  name: string
  slug: string
  location: string | null
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row?: DepartmentRow): EntityFieldConfig[] {
  return [
    { name: "name", label: "Name", required: true, defaultValue: row?.name },
    { name: "description", label: "Description", type: "textarea" },
    { name: "location", label: "Location", defaultValue: row?.location ?? "" },
    { name: "phone", label: "Phone" },
    { name: "email", label: "Email" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminDepartmentsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_departments")
    .select("id, name, slug, location, status")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })

  const departments = (data ?? []) as DepartmentRow[]

  const columns: DataTableColumn<DepartmentRow>[] = [
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage hospital departments shown on the public site.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={departments}
        searchKeys={["name", "location"]}
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Department
              </Button>
            }
            title="New Department"
            fields={fieldsFor()}
            action={createDepartment}
          />
        }
        renderActions={(row) => (
          <div className="flex justify-end gap-1">
            <EntityFormDialog
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="Edit">
                  <Pencil className="size-4" aria-hidden="true" />
                </Button>
              }
              title={`Edit ${row.name}`}
              fields={fieldsFor(row)}
              action={updateDepartment}
              hiddenFields={{ id: row.id }}
            />
            <DeleteButton id={row.id} action={deleteDepartment} confirmMessage={`Delete ${row.name}?`} />
          </div>
        )}
      />
    </div>
  )
}
