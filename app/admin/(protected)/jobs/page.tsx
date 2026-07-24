import Link from "next/link"
import { Pencil, Plus, Users } from "lucide-react"

import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createJob, deleteJob, updateJob } from "@/lib/actions/admin/jobs"
import { createClient } from "@/lib/supabase/server"

type JobRow = {
  id: string
  title: string
  location: string
  contract_type: string
  application_deadline: string
  status: string
  applicantCount: number
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
]

const CONTRACT_OPTIONS = [
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "locum", label: "Locum" },
]

function fieldsFor(row?: JobRow): EntityFieldConfig[] {
  return [
    { name: "title", label: "Job title", required: true, defaultValue: row?.title },
    { name: "location", label: "Location", required: true, defaultValue: row?.location },
    { name: "contract_type", label: "Contract type", type: "select", options: CONTRACT_OPTIONS, defaultValue: row?.contract_type ?? "full_time" },
    { name: "application_deadline", label: "Application deadline", type: "date", required: true, defaultValue: row?.application_deadline },
    { name: "positions_available", label: "Positions available", type: "number", defaultValue: "1" },
    { name: "salary_range", label: "Salary range" },
    { name: "experience_required", label: "Experience required" },
    { name: "qualifications", label: "Qualifications", type: "textarea" },
    { name: "responsibilities", label: "Responsibilities", type: "textarea" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminJobsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_jobs")
    .select("id, title, location, contract_type, application_deadline, status")
    .is("deleted_at", null)
    .order("application_deadline", { ascending: true })

  const jobIds = (data ?? []).map((j) => j.id)
  const { data: applications } = jobIds.length
    ? await supabase.from("margaret_job_applications").select("job_id").in("job_id", jobIds).is("deleted_at", null)
    : { data: [] }

  const countsByJob = new Map<string, number>()
  for (const app of applications ?? []) {
    countsByJob.set(app.job_id, (countsByJob.get(app.job_id) ?? 0) + 1)
  }

  const jobs: JobRow[] = (data ?? []).map((job) => ({ ...job, applicantCount: countsByJob.get(job.id) ?? 0 }))

  const columns: DataTableColumn<JobRow>[] = [
    { key: "title", label: "Title" },
    { key: "location", label: "Location" },
    { key: "application_deadline", label: "Deadline" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>,
    },
    {
      key: "applicantCount",
      label: "Applicants",
      render: (row) => (
        <Link href={`/admin/jobs/${row.id}/applications`} className="flex items-center gap-1.5 text-brand-deep hover:underline dark:text-brand-accent">
          <Users className="size-3.5" aria-hidden="true" /> {row.applicantCount}
        </Link>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Careers / Jobs</h1>
        <p className="text-muted-foreground">Manage open positions on the public careers page.</p>
      </div>

      <DataTable
        columns={columns}
        rows={jobs}
        searchKeys={["title", "location"]}
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Job
              </Button>
            }
            title="New Job"
            fields={fieldsFor()}
            action={createJob}
          />
        }
        renderActions={(row) => (
          <div className="flex justify-end gap-1">
            <EntityFormDialog
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="Edit">
                  <Pencil className="size-4" aria-hidden="true" />
                </Button>
              }
              title={`Edit ${row.title}`}
              fields={fieldsFor(row)}
              action={updateJob}
              hiddenFields={{ id: row.id }}
            />
            <DeleteButton id={row.id} action={deleteJob} confirmMessage={`Delete ${row.title}?`} />
          </div>
        )}
      />
    </div>
  )
}
