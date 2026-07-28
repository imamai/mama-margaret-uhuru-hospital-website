import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { blocksToText } from "@/lib/actions/admin/blocks"
import { createPage, deletePage, updatePage } from "@/lib/actions/admin/pages"
import { createClient } from "@/lib/supabase/server"

type Row = { id: string; title: string; slug: string; excerpt: string | null; content: unknown; parent_id: string | null; status: string }

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default async function AdminPagesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_pages")
    .select("id, title, slug, excerpt, content, parent_id, status")
    .is("deleted_at", null)
    .order("title")

  const rows = (data ?? []) as Row[]
  const parentOptions = rows.map((r) => ({ value: r.id, label: r.title }))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "title", label: "Title", required: true, defaultValue: row?.title },
      {
        name: "parentId",
        label: "Parent page",
        type: "select",
        options: [{ value: "", label: "None" }, ...parentOptions.filter((p) => p.value !== row?.id)],
        defaultValue: row?.parent_id ?? "",
      },
      { name: "excerpt", label: "Excerpt", type: "textarea", defaultValue: row?.excerpt ?? "" },
      { name: "body", label: "Body", type: "textarea", defaultValue: row ? blocksToText(row.content) : "", hint: "Separate paragraphs with a blank line." },
      { name: "featuredImage", label: row ? "Replace featured image" : "Featured image", type: "file", accept: "image/*" },
      { name: "seoTitle", label: "SEO title" },
      { name: "seoDescription", label: "SEO description", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.title.toLowerCase(),
    cells: [row.title, row.slug, <Badge key="status" variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>],
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
          action={updatePage}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deletePage} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage static content pages (About, Policies, Patient Rights, etc.).</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Page
            </Button>
          }
          title="New Page"
          fields={fieldsFor()}
          action={createPage}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
