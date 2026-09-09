import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createEvent, deleteEvent, updateEvent } from "@/lib/actions/admin/events"
import { createClient } from "@/lib/supabase/server"

type Row = {
  id: string
  title: string
  event_type: string
  location: string | null
  is_virtual: boolean
  virtual_link: string | null
  starts_at: string
  ends_at: string | null
  registration_required: boolean
  capacity: number | null
  status: string
}

const EVENT_TYPE_OPTIONS = [
  { value: "conference", label: "Conference" },
  { value: "medical_camp", label: "Medical Camp" },
  { value: "training", label: "Training" },
  { value: "webinar", label: "Webinar" },
  { value: "event", label: "Event" },
]

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
]

function toLocalInput(value: string | null): string | undefined {
  if (!value) return undefined
  return value.slice(0, 16)
}

function fieldsFor(row?: Row): EntityFieldConfig[] {
  return [
    { name: "title", label: "Title", required: true, defaultValue: row?.title },
    { name: "eventType", label: "Type", type: "select", options: EVENT_TYPE_OPTIONS, defaultValue: row?.event_type ?? "event" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "location", label: "Location", defaultValue: row?.location ?? "" },
    { name: "isVirtual", label: "Virtual event", type: "checkbox", defaultValue: String(row?.is_virtual ?? false) },
    { name: "virtualLink", label: "Virtual link", defaultValue: row?.virtual_link ?? "" },
    { name: "startsAt", label: "Starts at", type: "datetime-local", required: true, defaultValue: toLocalInput(row?.starts_at ?? null) },
    { name: "endsAt", label: "Ends at", type: "datetime-local", defaultValue: toLocalInput(row?.ends_at ?? null) },
    { name: "registrationRequired", label: "Registration required", type: "checkbox", defaultValue: String(row?.registration_required ?? false) },
    { name: "capacity", label: "Capacity", type: "number", defaultValue: row?.capacity ? String(row.capacity) : undefined },
    { name: "featuredImage", label: row ? "Replace featured image" : "Featured image", type: "image" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_events")
    .select("id, title, event_type, location, is_virtual, virtual_link, starts_at, ends_at, registration_required, capacity, status")
    .is("deleted_at", null)
    .order("starts_at", { ascending: false })

  const rows = (data ?? []) as Row[]
  const typeLabel = new Map(EVENT_TYPE_OPTIONS.map((t) => [t.value, t.label]))

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "starts_at", label: "Starts" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: `${row.title} ${row.location ?? ""}`.toLowerCase(),
    cells: [
      row.title,
      typeLabel.get(row.event_type) ?? row.event_type,
      new Date(row.starts_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" }),
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
          action={updateEvent}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteEvent} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage conferences, medical camps, trainings, and webinars.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Event
            </Button>
          }
          title="New Event"
          fields={fieldsFor()}
          action={createEvent}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
