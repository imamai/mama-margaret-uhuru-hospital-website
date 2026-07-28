import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { blocksToText } from "@/lib/actions/admin/blocks"
import { createPressRelease, deletePressRelease, updatePressRelease } from "@/lib/actions/admin/press-releases"
import { createClient } from "@/lib/supabase/server"

type Row = {
  id: string
  title: string
  summary: string | null
  content: unknown
  media_contact_name: string | null
  media_contact_email: string | null
  media_contact_phone: string | null
  published_at: string | null
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "title", label: "Title", required: true, defaultValue: row?.title },
    { name: "summary", label: "Summary", type: "textarea", defaultValue: row?.summary ?? "" },
    { name: "body", label: "Body", type: "textarea", defaultValue: row ? blocksToText(row.content) : "", hint: "Separate paragraphs with a blank line." },
    { name: "file", label: row ? "Replace attachment" : "Attachment (PDF)", type: "file", accept: ".pdf,application/pdf" },
    { name: "mediaContactName", label: "Media contact name", defaultValue: row?.media_contact_name ?? "" },
    { name: "mediaContactEmail", label: "Media contact email", defaultValue: row?.media_contact_email ?? "" },
    { name: "mediaContactPhone", label: "Media contact phone", defaultValue: row?.media_contact_phone ?? "" },
    { name: "publishedAt", label: "Published at", type: "date", defaultValue: row?.published_at?.slice(0, 10) },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminPressReleasesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_press_releases")
    .select("id, title, summary, content, media_contact_name, media_contact_email, media_contact_phone, published_at, status")
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false })

  const rows = (data ?? []) as Row[]

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.title.toLowerCase(),
    cells: [row.title, <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>],
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
          action={updatePressRelease}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deletePressRelease} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Press Releases</h1>
          <p className="text-muted-foreground">Manage press releases shown on the media centre page.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Press Release
            </Button>
          }
          title="New Press Release"
          fields={fieldsFor()}
          action={createPressRelease}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
