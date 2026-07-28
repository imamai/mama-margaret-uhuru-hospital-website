import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createLibraryItem, deleteLibraryItem, updateLibraryItem } from "@/lib/actions/admin/library-items"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; title: string; item_type: string; published_year: number | null; status: string }

const ITEM_TYPE_OPTIONS = [
  { value: "publication", label: "Publication" },
  { value: "guideline", label: "Guideline" },
  { value: "manual", label: "Manual" },
  { value: "annual_report", label: "Annual Report" },
]

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "title", label: "Title", required: true, defaultValue: row?.title },
    { name: "itemType", label: "Type", type: "select", options: ITEM_TYPE_OPTIONS, defaultValue: row?.item_type ?? "publication" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "file", label: row ? "Replace file" : "File", type: "file", accept: ".pdf,application/pdf", required: !row },
    { name: "publishedYear", label: "Published year", type: "number", defaultValue: row?.published_year ? String(row.published_year) : undefined },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminLibraryItemsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_library_items")
    .select("id, title, item_type, published_year, status")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  const rows = (data ?? []) as Row[]
  const typeLabel = new Map(ITEM_TYPE_OPTIONS.map((t) => [t.value, t.label]))

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.title.toLowerCase(),
    cells: [row.title, typeLabel.get(row.item_type) ?? row.item_type, <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>],
    actions: (
      <div className="flex justify-end gap-1">
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit ${row.title}`}
          fields={fieldsFor(row)}
          action={updateLibraryItem}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteLibraryItem} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Library</h1>
          <p className="text-muted-foreground">Manage publications, guidelines, manuals, and annual reports.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Item
            </Button>
          }
          title="New Library Item"
          fields={fieldsFor()}
          action={createLibraryItem}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
