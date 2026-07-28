import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createNewsCategory, deleteNewsCategory, updateNewsCategory } from "@/lib/actions/admin/news-categories"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; name: string; status: string }

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "name", label: "Name", required: true, defaultValue: row?.name },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "active" },
  ]
}

export default async function AdminNewsCategoriesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("margaret_news_categories").select("id, name, status").order("name")

  const rows = (data ?? []) as Row[]

  const columns: DataTableColumn[] = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.name.toLowerCase(),
    cells: [row.name, <Badge key="status" variant={row.status === "active" ? "default" : "outline"}>{row.status}</Badge>],
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
          action={updateNewsCategory}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteNewsCategory} confirmMessage={`Delete ${row.name}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">News Categories</h1>
        <p className="text-muted-foreground">Group news articles for filtering on the public site.</p>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        searchable
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Category
              </Button>
            }
            title="New News Category"
            fields={fieldsFor()}
            action={createNewsCategory}
          />
        }
      />
    </div>
  )
}
