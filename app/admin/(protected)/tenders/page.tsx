import Link from "next/link"
import { Eye, Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createTender, deleteTender, updateTender } from "@/lib/actions/admin/tenders"
import { createClient } from "@/lib/supabase/server"

type TenderRow = {
  id: string
  title: string
  tender_number: string
  closing_date: string
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
  { value: "awarded", label: "Awarded" },
  { value: "cancelled", label: "Cancelled" },
]

const STAGE_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "technical", label: "Technical Evaluation" },
  { value: "financial", label: "Financial Evaluation" },
  { value: "completed", label: "Completed" },
]

function fieldsFor(row?: TenderRow & { description?: string; eligibility?: string; opening_date?: string; evaluation_stage?: string }): EntityFieldConfig[] {
  return [
    { name: "title", label: "Title", required: true, defaultValue: row?.title },
    { name: "tender_number", label: "Tender number", required: true, defaultValue: row?.tender_number },
    { name: "description", label: "Description", type: "textarea", defaultValue: row?.description },
    { name: "eligibility", label: "Eligibility", type: "textarea", defaultValue: row?.eligibility },
    { name: "closing_date", label: "Closing date", type: "date", required: true, defaultValue: row?.closing_date?.slice(0, 10) },
    { name: "opening_date", label: "Opening date", type: "date", defaultValue: row?.opening_date?.slice(0, 10) },
    { name: "evaluation_stage", label: "Evaluation stage", type: "select", options: STAGE_OPTIONS, defaultValue: row?.evaluation_stage ?? "not_started" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
  ]
}

export default async function AdminTendersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_tenders")
    .select("id, title, tender_number, description, eligibility, closing_date, opening_date, evaluation_stage, status")
    .is("deleted_at", null)
    .order("closing_date", { ascending: false })

  const tenders = (data ?? []) as (TenderRow & { description: string; eligibility: string; opening_date: string; evaluation_stage: string })[]

  const columns: DataTableColumn[] = [
    { key: "tender_number", label: "Number" },
    { key: "title", label: "Title" },
    { key: "closing_date", label: "Closes" },
    { key: "status", label: "Status" },
  ]

  const rows: DataTableRow[] = tenders.map((row) => ({
    id: row.id,
    searchText: `${row.title} ${row.tender_number}`.toLowerCase(),
    cells: [
      row.tender_number,
      row.title,
      new Date(row.closing_date).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" }),
      <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>
        {row.status}
      </Badge>,
    ],
    actions: (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Manage" asChild>
          <Link href={`/admin/tenders/${row.id}`}>
            <Eye className="size-4" aria-hidden="true" />
          </Link>
        </Button>
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit ${row.title}`}
          fields={fieldsFor(row)}
          action={updateTender}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteTender} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tenders</h1>
        <p className="text-muted-foreground">Manage procurement tenders, documents, clarifications, and awards.</p>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        searchable
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Tender
              </Button>
            }
            title="New Tender"
            fields={fieldsFor()}
            action={createTender}
          />
        }
      />
    </div>
  )
}
