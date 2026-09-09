import { Pencil, Plus } from "lucide-react"
import Image from "next/image"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createInsurancePartner, deleteInsurancePartner, updateInsurancePartner } from "@/lib/actions/admin/insurance-partners"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; name: string; logo_url: string | null; status: string }

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "name", label: "Name", required: true, defaultValue: row?.name },
    { name: "websiteUrl", label: "Website URL" },
    { name: "logo", label: row ? "Replace logo" : "Logo", type: "image" },
    { name: "sortOrder", label: "Sort order", type: "number", defaultValue: "0" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "active" },
  ]
}

export default async function AdminInsurancePartnersPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("margaret_insurance_partners").select("id, name, logo_url, status").order("sort_order", { ascending: true })

  const rows = (data ?? []) as Row[]

  const columns: DataTableColumn[] = [
    { key: "logo", label: "Logo" },
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.name.toLowerCase(),
    cells: [
      row.logo_url ? <Image key="logo" src={row.logo_url} alt="" width={64} height={36} className="rounded border object-contain" unoptimized /> : "—",
      row.name,
      <Badge key="status" variant={row.status === "active" ? "default" : "outline"}>{row.status}</Badge>,
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
          action={updateInsurancePartner}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteInsurancePartner} confirmMessage={`Delete ${row.name}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Insurance Partners</h1>
        <p className="text-muted-foreground">Manage the insurance providers accepted by the hospital.</p>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        searchable
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Insurance Partner
              </Button>
            }
            title="New Insurance Partner"
            fields={fieldsFor()}
            action={createInsurancePartner}
          />
        }
      />
    </div>
  )
}
