import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createDoctor, deleteDoctor, updateDoctor } from "@/lib/actions/admin/doctors"
import { createClient } from "@/lib/supabase/server"

type DoctorRow = {
  id: string
  full_name: string
  specialization: string
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row?: DoctorRow): EntityFieldConfig[] {
  return [
    { name: "full_name", label: "Full name", required: true, defaultValue: row?.full_name },
    { name: "specialization", label: "Specialization", required: true, defaultValue: row?.specialization },
    { name: "title", label: "Title (e.g. Senior Consultant)" },
    { name: "years_experience", label: "Years of experience", type: "number" },
    { name: "biography", label: "Biography", type: "textarea" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminDoctorsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_doctors")
    .select("id, full_name, specialization, status")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })

  const doctors = (data ?? []) as DoctorRow[]

  const columns: DataTableColumn[] = [
    { key: "full_name", label: "Name" },
    { key: "specialization", label: "Specialization" },
    { key: "status", label: "Status" },
  ]

  const rows: DataTableRow[] = doctors.map((row) => ({
    id: row.id,
    searchText: `${row.full_name} ${row.specialization}`.toLowerCase(),
    cells: [
      row.full_name,
      row.specialization,
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
          title={`Edit ${row.full_name}`}
          fields={fieldsFor(row)}
          action={updateDoctor}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteDoctor} confirmMessage={`Delete ${row.full_name}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <p className="text-muted-foreground">Manage doctor profiles shown on the public site.</p>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        searchable
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Doctor
              </Button>
            }
            title="New Doctor"
            fields={fieldsFor()}
            action={createDoctor}
          />
        }
      />
    </div>
  )
}
