import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from "@/lib/actions/admin/announcements"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; title: string; message: string; announcement_type: string; status: string }

const TYPE_OPTIONS = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "emergency", label: "Emergency" },
  { value: "success", label: "Success" },
]

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "title", label: "Title", required: true, defaultValue: row?.title },
    { name: "message", label: "Message", type: "textarea", required: true, defaultValue: row?.message },
    { name: "announcementType", label: "Type", type: "select", options: TYPE_OPTIONS, defaultValue: row?.announcement_type ?? "info" },
    { name: "linkUrl", label: "Link URL" },
    { name: "startsAt", label: "Starts at", type: "date" },
    { name: "endsAt", label: "Ends at", type: "date" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_announcements")
    .select("id, title, message, announcement_type, status")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  const rows = (data ?? []) as Row[]

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.title.toLowerCase(),
    cells: [
      row.title,
      <Badge key="type" variant="outline">{row.announcement_type}</Badge>,
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
          action={updateAnnouncement}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteAnnouncement} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Manage site-wide banner announcements.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Announcement
            </Button>
          }
          title="New Announcement"
          fields={fieldsFor()}
          action={createAnnouncement}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
