import { Pencil, Plus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { blocksToText } from "@/lib/actions/admin/blocks"
import { createNews, deleteNews, updateNews } from "@/lib/actions/admin/news"
import { createClient } from "@/lib/supabase/server"

type Row = {
  id: string
  title: string
  category_id: string | null
  excerpt: string | null
  content: unknown
  author_name: string | null
  tags: string[]
  is_featured: boolean
  is_breaking: boolean
  published_at: string | null
  status: string
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const [{ data }, { data: categories }] = await Promise.all([
    supabase
      .from("margaret_news")
      .select("id, title, category_id, excerpt, content, author_name, tags, is_featured, is_breaking, published_at, status")
      .is("deleted_at", null)
      .order("published_at", { ascending: false, nullsFirst: false }),
    supabase.from("margaret_news_categories").select("id, name").order("name"),
  ])

  const rows = (data ?? []) as Row[]
  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }))
  const categoryName = new Map((categories ?? []).map((c) => [c.id, c.name]))

  function fieldsFor(row?: Row): EntityFieldConfig[] {
    return [
      { name: "title", label: "Title", required: true, defaultValue: row?.title },
      { name: "categoryId", label: "Category", type: "select", options: [{ value: "", label: "None" }, ...categoryOptions], defaultValue: row?.category_id ?? "" },
      { name: "excerpt", label: "Excerpt", type: "textarea", defaultValue: row?.excerpt ?? "" },
      { name: "body", label: "Body", type: "textarea", defaultValue: row ? blocksToText(row.content) : "", hint: "Separate paragraphs with a blank line." },
      { name: "featuredImage", label: row ? "Replace featured image" : "Featured image", type: "image" },
      { name: "authorName", label: "Author name", defaultValue: row?.author_name ?? "" },
      { name: "tags", label: "Tags (comma separated)", defaultValue: row?.tags?.join(", ") ?? "" },
      { name: "isFeatured", label: "Featured on homepage", type: "checkbox", defaultValue: String(row?.is_featured ?? false) },
      { name: "isBreaking", label: "Breaking news", type: "checkbox", defaultValue: String(row?.is_breaking ?? false) },
      { name: "publishedAt", label: "Published at", type: "date", defaultValue: row?.published_at?.slice(0, 10) },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: row?.status ?? "draft" },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ]

  const tableRows: DataTableRow[] = rows.map((row) => ({
    id: row.id,
    searchText: row.title.toLowerCase(),
    cells: [
      <span key="title" className="flex items-center gap-1.5">
        {row.title}
        {row.is_breaking ? <Badge variant="destructive">Breaking</Badge> : null}
      </span>,
      row.category_id ? (categoryName.get(row.category_id) ?? "—") : "—",
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
          action={updateNews}
          hiddenFields={{ id: row.id }}
        />
        <DeleteButton id={row.id} action={deleteNews} confirmMessage={`Delete ${row.title}?`} />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">News</h1>
          <p className="text-muted-foreground">Manage news articles shown on the public site.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Article
            </Button>
          }
          title="New Article"
          fields={fieldsFor()}
          action={createNews}
        />
      </div>

      <DataTable columns={columns} rows={tableRows} searchable />
    </div>
  )
}
