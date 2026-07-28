import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createContact, deleteContact, updateContact } from "@/lib/actions/admin/contacts"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; name: string; contact_type: string; department_id: string | null; phone: string | null; email: string | null; status: string }

const CONTACT_TYPE_OPTIONS = [
  { value: "department", label: "Department" },
  { value: "emergency", label: "Emergency" },
  { value: "general", label: "General" },
  { value: "media", label: "Media" },
]

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default async function AdminContactsPage() {
  const supabase = await createClient()
  const [{ data }, { data: departments }] = await Promise.all([
    supabase.from("margaret_contacts").select("id, name, contact_type, department_id, phone, email, status").order("sort_order", { ascending: true }),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "name", label: "Name", required: true, defaultValue: row?.name },
      { name: "contactType", label: "Type", type: "select", options: CONTACT_TYPE_OPTIONS, defaultValue: row?.contact_type ?? "general" },
      { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
      { name: "phone", label: "Phone", defaultValue: row?.phone ?? "" },
      { name: "alternatePhone", label: "Alternate phone" },
      { name: "email", label: "Email", defaultValue: row?.email ?? "" },
      { name: "location", label: "Location" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "active" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: `${row.name} ${row.phone ?? ""} ${row.email ?? ""}`.toLowerCase(),
    cells: [row.name, row.contact_type, row.phone ?? "—", <Badge key="status" variant={row.status === "active" ? "default" : "outline"}>{row.status}</Badge>],
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
          action={updateContact}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteContact} confirmMessage={`Delete ${row.name}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage the contact directory shown on the public contact page.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Contact
            </Button>
          }
          title="New Contact"
          fields={fieldsFor()}
          action={createContact}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
