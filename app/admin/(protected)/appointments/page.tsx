import { Pencil } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { AppointmentStatusButtons } from "@/components/admin/appointment-status-buttons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { deleteAppointment, updateAppointment } from "@/lib/actions/admin/appointments"
import { createClient } from "@/lib/supabase/server"

type Row = {
  id: string
  patient_name: string
  patient_phone: string
  patient_email: string | null
  department_id: string | null
  doctor_id: string | null
  preferred_date: string
  preferred_time: string | null
  reason: string | null
  is_insured: boolean
  insurance_provider: string | null
  notes: string | null
  status: string
  created_at: string
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "Did not attend" },
]

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "Did not attend",
}

/** Pending is the one that needs somebody; the rest are settled. */
function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  if (status === "pending") return "default"
  if (status === "confirmed") return "secondary"
  if (status === "cancelled" || status === "no_show") return "destructive"
  return "outline"
}

function formatDate(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Stored as a time, shown without the seconds nobody chose. */
function formatTime(value: string | null): string {
  if (!value) return "Any time"
  return value.slice(0, 5)
}

/**
 * Appointment requests from the public site.
 *
 * Until this page existed, `margaret_appointments` was written to and never
 * read: a patient booked, saw "success", and the request sat in a table with
 * no screen. The permissions (appointments.view / appointments.manage) and the
 * RLS policies were already in place, waiting for it.
 *
 * Ordered by the date the patient asked for, not by when they submitted —
 * tomorrow's request matters more than one that arrived first for next month.
 */
export default async function AdminAppointmentsPage() {
  const supabase = await createClient()

  const [{ data }, { data: departments }, { data: doctors }] = await Promise.all([
    supabase
      .from("margaret_appointments")
      .select(
        "id, patient_name, patient_phone, patient_email, department_id, doctor_id, preferred_date, preferred_time, reason, is_insured, insurance_provider, notes, status, created_at"
      )
      .is("deleted_at", null)
      .order("preferred_date", { ascending: true })
      .order("preferred_time", { ascending: true, nullsFirst: false }),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
    supabase.from("margaret_doctors").select("id, full_name").is("deleted_at", null).order("full_name"),
  ])

  const rows = (data ?? []) as Row[]
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))
  const doctorOptions = (doctors ?? []).map((d) => ({
    value: d.id as string,
    label: d.full_name as string,
  }))

  const departmentName = new Map(departmentOptions.map((d) => [d.value, d.label]))

  const pending = rows.filter((r) => r.status === "pending").length

  function fieldsFor(row: Row): EntityFieldConfig[] {
    return [
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row.status },
      {
        name: "departmentId",
        label: "Department",
        type: "select",
        options: [{ value: "", label: "Not assigned" }, ...departmentOptions],
        defaultValue: row.department_id ?? "",
      },
      {
        name: "doctorId",
        label: "Doctor",
        type: "select",
        options: [{ value: "", label: "Not assigned" }, ...doctorOptions],
        defaultValue: row.doctor_id ?? "",
      },
      { name: "preferredDate", label: "Date", type: "date", defaultValue: row.preferred_date },
      { name: "preferredTime", label: "Time", defaultValue: row.preferred_time?.slice(0, 5) ?? "" },
      { name: "notes", label: "Internal note", type: "textarea", defaultValue: row.notes ?? "" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "patient", label: "Patient" },
    { key: "when", label: "Requested for" },
    { key: "department", label: "Department" },
    { key: "insurance", label: "Insurance" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText:
      `${row.patient_name} ${row.patient_phone} ${row.patient_email ?? ""} ${row.reason ?? ""} ${row.status}`.toLowerCase(),
    cells: [
      <div key="patient">
        <div className="font-medium">{row.patient_name}</div>
        <div className="text-muted-foreground text-xs">
          {row.patient_phone}
          {row.patient_email ? ` · ${row.patient_email}` : ""}
        </div>
        {row.reason ? (
          <div className="text-muted-foreground mt-1 max-w-sm text-xs italic">{row.reason}</div>
        ) : null}
      </div>,
      <div key="when">
        <div>{formatDate(row.preferred_date)}</div>
        <div className="text-muted-foreground text-xs">{formatTime(row.preferred_time)}</div>
      </div>,
      row.department_id ? (departmentName.get(row.department_id) ?? "—") : "—",
      row.is_insured ? (row.insurance_provider || "Insured") : "Self-paying",
      <Badge key="status" variant={statusVariant(row.status)}>
        {STATUS_LABEL[row.status] ?? row.status}
      </Badge>,
    ],
    actions: (
      <div className="flex justify-end gap-1">
        {row.status === "pending" && <AppointmentStatusButtons id={row.id} />}
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`${row.patient_name} — ${formatDate(row.preferred_date)}`}
          fields={fieldsFor(row)}
          action={updateAppointment}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton
          id={row.id}
          action={deleteAppointment}
          confirmMessage={`Remove ${row.patient_name}'s request from this list? Cancelling is usually what you want instead.`}
        />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="text-muted-foreground">
          Requests booked from the website, soonest first.{" "}
          {pending > 0 ? (
            <span className="text-foreground font-medium">
              {pending} waiting for a reply.
            </span>
          ) : (
            "Nothing is waiting for a reply."
          )}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="font-medium">No appointment requests yet.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Bookings made on the website appear here as soon as they are submitted.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} rows={tableRows} searchable />
      )}
    </div>
  )
}
