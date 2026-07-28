import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createStat, deleteStat, updateStat } from "@/lib/actions/admin/stats"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; label: string; value: string; icon: string | null; sort_order: number; status: string }

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "label", label: "Label", required: true, defaultValue: row?.label },
    { name: "value", label: "Value", required: true, defaultValue: row?.value, hint: "e.g. \"60+\" or \"2,000+\"" },
    { name: "icon", label: "Icon name", defaultValue: row?.icon ?? "", hint: "A lucide-react icon name, e.g. \"Bed\"" },
    { name: "sortOrder", label: "Sort order", type: "number", defaultValue: String(row?.sort_order ?? 0) },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "active" },
  ]
}

export default async function AdminStatsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("margaret_stats").select("id, label, value, icon, sort_order, status").order("sort_order", { ascending: true })

  const rows = (data ?? []) as Row[]

  const columns: DataTableColumn[] = [
    { key: "label", label: "Label" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.label.toLowerCase(),
    cells: [row.label, row.value, <Badge key="status" variant={row.status === "active" ? "default" : "outline"}>{row.status}</Badge>],
    actions: (
      <div className="flex justify-end gap-1">
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit ${row.label}`}
          fields={fieldsFor(row)}
          action={updateStat}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteStat} confirmMessage={`Delete ${row.label}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Homepage Stats</h1>
        <p className="text-muted-foreground">Manage the highlight numbers shown on the homepage (beds, years, doctors, etc.).</p>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        searchable
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Stat
              </Button>
            }
            title="New Stat"
            fields={fieldsFor()}
            action={createStat}
          />
        }
      />
    </div>
  )
}
