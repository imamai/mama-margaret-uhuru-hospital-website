import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createDownload, deleteDownload, updateDownload } from "@/lib/actions/admin/downloads"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; title: string; category: string | null; file_size_kb: number | null; status: string }

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "title", label: "Title", required: true, defaultValue: row?.title },
    { name: "category", label: "Category", defaultValue: row?.category ?? "" },
    { name: "file", label: row ? "Replace file" : "File", type: "file", required: !row },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "published" },
  ]
}

export default async function AdminDownloadsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_downloads")
    .select("id, title, category, file_size_kb, status")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })

  const rows = (data ?? []) as Row[]

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "size", label: "Size" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: `${row.title} ${row.category ?? ""}`.toLowerCase(),
    cells: [
      row.title,
      row.category ?? "—",
      row.file_size_kb ? `${(row.file_size_kb / 1024).toFixed(1)} MB` : "—",
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
          title={`Edit ${row.title}`}
          fields={fieldsFor(row)}
          action={updateDownload}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteDownload} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Downloads</h1>
          <p className="text-muted-foreground">Manage general documents and resources available for download.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Download
            </Button>
          }
          title="New Download"
          fields={fieldsFor()}
          action={createDownload}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
