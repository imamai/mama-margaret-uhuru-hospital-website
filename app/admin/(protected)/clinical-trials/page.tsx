import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClinicalTrial, deleteClinicalTrial, updateClinicalTrial } from "@/lib/actions/admin/clinical-trials"
import { createClient } from "@/lib/supabase/server"

type Row = {
  id: string
  title: string
  trial_phase: string | null
  condition_studied: string | null
  department_id: string | null
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "recruiting", label: "Recruiting" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
]

export default async function AdminClinicalTrialsPage() {
  const supabase = await createClient()
  const [{ data }, { data: departments }] = await Promise.all([
    supabase
      .from("margaret_clinical_trials")
      .select("id, title, trial_phase, condition_studied, department_id, status")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase.from("margaret_departments").select("id, name").is("deleted_at", null).order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const departmentOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "title", label: "Title", required: true, defaultValue: row?.title },
      { name: "trialPhase", label: "Trial phase", defaultValue: row?.trial_phase ?? "", hint: "e.g. \"Phase II\"" },
      { name: "conditionStudied", label: "Condition studied", defaultValue: row?.condition_studied ?? "" },
      { name: "principalInvestigator", label: "Principal investigator" },
      { name: "departmentId", label: "Department", type: "select", options: [{ value: "", label: "None" }, ...departmentOptions], defaultValue: row?.department_id ?? "" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "eligibilityCriteria", label: "Eligibility criteria", type: "textarea" },
      { name: "contactEmail", label: "Contact email" },
      { name: "startsAt", label: "Starts", type: "date" },
      { name: "endsAt", label: "Ends", type: "date" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "phase", label: "Phase" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: `${row.title} ${row.condition_studied ?? ""}`.toLowerCase(),
    cells: [row.title, row.trial_phase ?? "—", <Badge key="status" variant={row.status === "recruiting" ? "default" : "outline"}>{row.status}</Badge>],
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
          action={updateClinicalTrial}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteClinicalTrial} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clinical Trials</h1>
          <p className="text-muted-foreground">Manage ongoing and completed clinical trials.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Trial
            </Button>
          }
          title="New Clinical Trial"
          fields={fieldsFor()}
          action={createClinicalTrial}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
