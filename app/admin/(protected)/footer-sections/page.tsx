import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createFooterSection, deleteFooterSection, updateFooterSection } from "@/lib/actions/admin/footer-sections"
import { createClient } from "@/lib/supabase/server"

type FooterContent = { body?: string; links?: { label: string; url: string }[] }
type Row = { id: string; title: string; content: unknown; status: string }

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

function fieldsFor(row?: Row): EntityFieldConfig[] {
  const content = (row?.content ?? {}) as FooterContent
  const linksText = (content.links ?? []).map((l) => `${l.label} | ${l.url}`).join("\n")

  return [
    { name: "title", label: "Title", required: true, defaultValue: row?.title },
    { name: "body", label: "Body text (optional)", type: "textarea", defaultValue: content.body ?? "" },
    {
      name: "links",
      label: "Links (optional)",
      type: "textarea",
      defaultValue: linksText,
      hint: "One per line, formatted as: Label | /url",
    },
    { name: "sortOrder", label: "Sort order", type: "number", defaultValue: "0" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "active" },
  ]
}

export default async function AdminFooterSectionsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("margaret_footer_sections").select("id, title, content, status").order("sort_order", { ascending: true })

  const rows = (data ?? []) as Row[]

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.title.toLowerCase(),
    cells: [row.title, <Badge key="status" variant={row.status === "active" ? "default" : "outline"}>{row.status}</Badge>],
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
          action={updateFooterSection}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteFooterSection} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Footer Sections</h1>
        <p className="text-muted-foreground">Manage the content blocks shown in the site footer.</p>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        searchable
        toolbar={
          <EntityFormDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" aria-hidden="true" /> New Section
              </Button>
            }
            title="New Footer Section"
            fields={fieldsFor()}
            action={createFooterSection}
          />
        }
      />
    </div>
  )
}
