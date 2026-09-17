import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  createScheduleEntry,
  deleteScheduleEntry,
  updateScheduleEntry,
} from "@/lib/actions/admin/clinic-schedule"
import { createClient } from "@/lib/supabase/server"

type Row = {
  id: string
  clinic_id: string | null
  clinic_label: string
  day_of_week: number
  start_time: string
  end_time: string | null
  specialist_name: string | null
  specialist_role: string | null
  doctor_id: string | null
  room: string | null
  notes: string | null
  sort_order: number
  status: string
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const DAY_OPTIONS = DAYS.map((d, i) => ({ value: String(i + 1), label: d }))

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft (hidden from site)" },
  { value: "archived", label: "Archived" },
]

/** Stored as a time; edited and shown as HH:MM. */
function hhmm(value: string | null): string {
  return value ? value.slice(0, 5) : ""
}

/**
 * The weekly consultant timetable shown on the public Clinics page.
 *
 * Sorted the way a patient reads it — by day, then by time — rather than by
 * when a row was entered, so the admin list and the public page agree.
 */
export default async function AdminClinicSchedulePage() {
  const supabase = await createClient()

  const [{ data }, { data: clinics }, { data: doctors }] = await Promise.all([
    supabase
      .from("margaret_clinic_schedule")
      .select(
        "id, clinic_id, clinic_label, day_of_week, start_time, end_time, specialist_name, specialist_role, doctor_id, room, notes, sort_order, status"
      )
      .is("deleted_at", null)
      .order("day_of_week")
      .order("start_time")
      .order("sort_order"),
    supabase.from("margaret_clinics").select("id, name").is("deleted_at", null).order("name"),
    supabase.from("margaret_doctors").select("id, full_name").is("deleted_at", null).order("full_name"),
  ])

  const rows = (data ?? []) as Row[]
  const clinicOptions = (clinics ?? []).map((c) => ({ value: c.id as string, label: c.name as string }))
  const doctorOptions = (doctors ?? []).map((d) => ({ value: d.id as string, label: d.full_name as string }))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "dayOfWeek", label: "Day", type: "select", options: DAY_OPTIONS, defaultValue: row ? String(row.day_of_week) : "1", required: true },
      {
        name: "clinicId",
        label: "Clinic",
        type: "select",
        options: [{ value: "", label: "Not listed — type the name below" }, ...clinicOptions],
        defaultValue: row?.clinic_id ?? "",
      },
      {
        name: "clinicLabel",
        label: "Clinic name as shown",
        defaultValue: row?.clinic_label ?? "",
        hint: "Leave blank to use the selected clinic's name.",
      },
      { name: "startTime", label: "Starts", defaultValue: hhmm(row?.start_time ?? "08:00"), required: true, hint: "24-hour, e.g. 08:00" },
      { name: "endTime", label: "Ends", defaultValue: hhmm(row?.end_time ?? null), hint: "Optional, e.g. 13:00" },
      { name: "specialistName", label: "Specialist", defaultValue: row?.specialist_name ?? "", hint: "As it should appear, e.g. Dr Obare" },
      { name: "specialistRole", label: "Specialist role", defaultValue: row?.specialist_role ?? "", hint: "e.g. Physician" },
      {
        name: "doctorId",
        label: "Link to doctor profile",
        type: "select",
        options: [{ value: "", label: "None" }, ...doctorOptions],
        defaultValue: row?.doctor_id ?? "",
        hint: "Optional. Not every consultant has a profile.",
      },
      { name: "room", label: "Room", defaultValue: row?.room ?? "" },
      { name: "notes", label: "Notes", type: "textarea", defaultValue: row?.notes ?? "" },
      { name: "sortOrder", label: "Order within the day", type: "number", defaultValue: String(row?.sort_order ?? 0) },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "published" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "day", label: "Day" },
    { key: "time", label: "Time" },
    { key: "clinic", label: "Clinic" },
    { key: "specialist", label: "Specialist" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: `${DAYS[row.day_of_week - 1]} ${row.clinic_label} ${row.specialist_name ?? ""} ${row.specialist_role ?? ""}`.toLowerCase(),
    cells: [
      DAYS[row.day_of_week - 1] ?? "—",
      row.end_time ? `${hhmm(row.start_time)}–${hhmm(row.end_time)}` : hhmm(row.start_time),
      row.clinic_label,
      <div key="who">
        <div>{row.specialist_name ?? "—"}</div>
        {row.specialist_role ? <div className="text-muted-foreground text-xs">{row.specialist_role}</div> : null}
      </div>,
      <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>
        {row.status}
      </Badge>,
    ],
    actions: (
      <div className="flex justify-end gap-1">
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`${row.clinic_label} — ${DAYS[row.day_of_week - 1]}`}
          fields={fieldsFor(row)}
          action={updateScheduleEntry}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton
          id={row.id}
          action={deleteScheduleEntry}
          confirmMessage={`Remove ${row.clinic_label} on ${DAYS[row.day_of_week - 1]} from the timetable?`}
        />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clinic Timetable</h1>
          <p className="text-muted-foreground">
            The weekly consultant schedule shown on the public Clinics page.
          </p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Sitting
            </Button>
          }
          title="New clinic sitting"
          fields={fieldsFor()}
          action={createScheduleEntry}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
