import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
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
  description: string | null
  location: string | null
  phone: string | null
  email: string | null
  operating_hours: Record<string, string> | null
  seo_title: string | null
  seo_description: string | null
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row?: DepartmentRow): EntityFieldConfig[] {
  const hoursText = row?.operating_hours
    ? Object.entries(row.operating_hours).map(([day, hours]) => `${day}: ${hours}`).join("\n")
    : ""

  return [
    { name: "name", label: "Name", required: true, defaultValue: row?.name },
    { name: "description", label: "Description", type: "textarea", defaultValue: row?.description ?? "" },
    { name: "location", label: "Location", defaultValue: row?.location ?? "" },
    { name: "phone", label: "Phone", defaultValue: row?.phone ?? "" },
    { name: "email", label: "Email", defaultValue: row?.email ?? "" },
    { name: "operatingHours", label: "Operating hours (one per line)", type: "textarea", defaultValue: hoursText, hint: "Format: Day: Hours, e.g. Monday: 8:00 AM - 5:00 PM" },
    { name: "bannerImage", label: row ? "Replace banner image" : "Banner image", type: "file", accept: "image/*", hint: "Leave blank to keep the current image." },
    { name: "seoTitle", label: "SEO title (optional)", defaultValue: row?.seo_title ?? "" },
    { name: "seoDescription", label: "SEO description (optional)", type: "textarea", defaultValue: row?.seo_description ?? "" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminDepartmentsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_departments")
    .select("id, name, slug, description, location, phone, email, operating_hours, seo_title, seo_description, status")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })

  const departments = (data ?? []) as DepartmentRow[]

  const columns: DataTableColumn[] = [
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ]

  const rows: DataTableRow[] = departments.map((row) => ({
    id: row.id,
    searchText: `${row.name} ${row.location ?? ""}`.toLowerCase(),
    cells: [
      row.name,
      row.location,
      <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>
        {row.status}
      </Badge>,
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
          action={updateDepartment}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteDepartment} confirmMessage={`Delete ${row.name}?`} />
      </div>
    ),
  }))

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
        rows={rows}
        searchable
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
      />
    </div>
  )
}
