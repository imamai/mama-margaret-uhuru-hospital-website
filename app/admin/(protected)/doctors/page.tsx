import Link from "next/link"
import { Eye, Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createDoctor, deleteDoctor, updateDoctor } from "@/lib/actions/admin/doctors"
import { createClient } from "@/lib/supabase/server"

type DoctorRow = {
  id: string
  full_name: string
  specialization: string
  department_id: string | null
  title: string | null
  years_experience: number | null
  biography: string | null
  email: string | null
  phone: string | null
  qualifications: string[]
  languages: string[]
  linkedin_url: string | null
  twitter_url: string | null
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

function fieldsFor(row: DoctorRow | undefined, departmentOptions: { value: string; label: string }[]): EntityFieldConfig[] {
  return [
    { name: "full_name", label: "Full name", required: true, defaultValue: row?.full_name },
    { name: "specialization", label: "Specialization", required: true, defaultValue: row?.specialization },
    { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
    { name: "title", label: "Title (e.g. Senior Consultant)", defaultValue: row?.title ?? "" },
    { name: "years_experience", label: "Years of experience", type: "number", defaultValue: row?.years_experience ? String(row.years_experience) : undefined },
    { name: "biography", label: "Biography", type: "textarea", defaultValue: row?.biography ?? "" },
    { name: "email", label: "Email", defaultValue: row?.email ?? "" },
    { name: "phone", label: "Phone", defaultValue: row?.phone ?? "" },
    { name: "qualifications", label: "Qualifications (one per line)", type: "textarea", defaultValue: row?.qualifications?.join("\n") ?? "" },
    { name: "languages", label: "Languages (comma separated)", defaultValue: row?.languages?.join(", ") ?? "" },
    { name: "linkedinUrl", label: "LinkedIn URL", defaultValue: row?.linkedin_url ?? "" },
    { name: "twitterUrl", label: "Twitter/X URL", defaultValue: row?.twitter_url ?? "" },
    { name: "photo", label: row ? "Replace photo" : "Photo", type: "file", accept: "image/*", hint: "Leave blank to keep the current photo." },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminDoctorsPage() {
  const supabase = await createClient()
  const [{ data }, { data: departments }] = await Promise.all([
    supabase
      .from("margaret_doctors")
      .select(
        "id, full_name, specialization, department_id, title, years_experience, biography, email, phone, qualifications, languages, linkedin_url, twitter_url, status"
      )
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const doctors = (data ?? []) as DoctorRow[]
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))

  const columns: DataTableColumn[] = [
    { key: "full_name", label: "Name" },
    { key: "specialization", label: "Specialization" },
    { key: "status", label: "Status" },
  ]

  const rows: DataTableRow[] = doctors.map((row) => ({
    id: row.id,
    searchText: `${row.full_name} ${row.specialization}`.toLowerCase(),
    cells: [
      row.full_name,
      row.specialization,
      <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>
        {row.status}
      </Badge>,
    ],
    actions: (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Manage availability & publications" asChild>
          <Link href={`/admin/doctors/${row.id}`}>
            <Eye className="size-4" aria-hidden="true" />
          </Link>
        </Button>
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit ${row.full_name}`}
          fields={fieldsFor(row, departmentOptions)}
          action={updateDoctor}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteDoctor} confirmMessage={`Delete ${row.full_name}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <p className="text-muted-foreground">Manage doctor profiles shown on the public site.</p>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        searchable
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Doctor
              </Button>
            }
            title="New Doctor"
            fields={fieldsFor(undefined, departmentOptions)}
            action={createDoctor}
          />
        }
      />
    </div>
  )
}
