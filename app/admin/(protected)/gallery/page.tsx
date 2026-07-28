import { Pencil, Plus } from "lucide-react"
import Image from "next/image"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from "@/lib/actions/admin/gallery"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; title: string | null; media_type: string; file_url: string; caption: string | null; status: string }

const MEDIA_TYPE_OPTIONS = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
]

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "title", label: "Title", defaultValue: row?.title ?? "" },
    { name: "mediaType", label: "Media type", type: "select", options: MEDIA_TYPE_OPTIONS, defaultValue: row?.media_type ?? "image" },
    { name: "file", label: row ? "Replace file" : "File", type: "file", accept: "image/*,video/*", required: !row, hint: "Leave blank to keep the current file." },
    { name: "caption", label: "Caption", type: "textarea", defaultValue: row?.caption ?? "" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "published" },
  ]
}

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_gallery")
    .select("id, title, media_type, file_url, caption, status")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })

  const rows = (data ?? []) as Row[]

  const columns: DataTableColumn[] = [
    { key: "preview", label: "Preview" },
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: (row.title ?? "").toLowerCase(),
    cells: [
      row.media_type === "image" ? (
        <Image key="preview" src={row.file_url} alt="" width={80} height={45} className="rounded-md border object-cover" unoptimized />
      ) : (
        <Badge key="preview" variant="outline">Video</Badge>
      ),
      row.title ?? "—",
      row.media_type,
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
          title={`Edit ${row.title ?? "gallery item"}`}
          fields={fieldsFor(row)}
          action={updateGalleryItem}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteGalleryItem} confirmMessage="Delete this gallery item?" />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Manage photos and videos shown across the public site.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Item
            </Button>
          }
          title="New Gallery Item"
          fields={fieldsFor()}
          action={createGalleryItem}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
