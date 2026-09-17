import { Download, FileText, Pencil } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { LibraryUploadForm } from "@/components/admin/library-upload-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { deleteLibraryDocument, updateLibraryDocument } from "@/lib/actions/admin/document-library"
import { createClient } from "@/lib/supabase/server"

type LibraryRow = {
  id: string
  title: string
  description: string | null
  file_url: string
  file_name: string | null
  file_size: number | null
  category: string
  sort_order: number
  status: string
}

const CATEGORY_LABELS: Record<string, string> = {
  rfq_form: "RFQ form",
  contract: "Contract",
  policy: "Policy",
  template: "Template",
  other: "Other",
}

function fileSize(bytes: number | null): string {
  if (!bytes) return "—"
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Documents procurement reuses across tenders.
 *
 * The same nine forms go out with every RFQ. Kept here, they are attached to a
 * tender by ticking a box instead of being found on someone's PC again — and
 * attaching copies the file, so replacing one here never changes a tender that
 * has already been published.
 */
export default async function AdminDocumentLibraryPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("margaret_document_library")
    .select("id, title, description, file_url, file_name, file_size, category, sort_order, status")
    .is("deleted_at", null)
    .order("category")
    .order("sort_order")
    .order("title")

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Document Library</h1>
        <p className="mt-2 text-muted-foreground">You don&apos;t have permission to view procurement documents.</p>
      </div>
    )
  }

  const rows = (data ?? []) as LibraryRow[]

  function fieldsFor(doc: LibraryRow): EntityFieldConfig[] {
    return [
      { name: "title", label: "Title", required: true, defaultValue: doc.title },
      { name: "description", label: "Description", type: "textarea", defaultValue: doc.description ?? "" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
        defaultValue: doc.category,
      },
      { name: "sortOrder", label: "Order", type: "number", defaultValue: String(doc.sort_order) },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive (hidden when attaching)" },
        ],
        defaultValue: doc.status,
      },
      {
        name: "file",
        label: "Replace the file",
        type: "file",
        accept: ".pdf,.doc,.docx",
        hint: "Optional. Tenders this is already attached to keep the file they were published with.",
      },
    ]
  }

  const columns: DataTableColumn[] = [
    { key: "title", label: "Document" },
    { key: "category", label: "Category" },
    { key: "size", label: "Size" },
    { key: "file", label: "File" },
  ]

  const tableRows: DataTableRow[] = rows.map((doc) => ({
    id: doc.id,
    searchText: `${doc.title} ${doc.description ?? ""} ${CATEGORY_LABELS[doc.category] ?? doc.category}`.toLowerCase(),
    cells: [
      <div key="title">
        <div className="font-medium">{doc.title}</div>
        {doc.description ? <div className="text-xs text-muted-foreground">{doc.description}</div> : null}
      </div>,
      <div key="cat" className="flex flex-wrap gap-1">
        <Badge variant="secondary">{CATEGORY_LABELS[doc.category] ?? doc.category}</Badge>
        {doc.status !== "active" ? <Badge variant="outline">Inactive</Badge> : null}
      </div>,
      fileSize(doc.file_size),
      <a
        key="file"
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <Download className="size-3.5" aria-hidden="true" />
        {doc.file_name ?? "Open"}
      </a>,
    ],
    actions: (
      <div className="flex justify-end gap-1">
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={doc.title}
          fields={fieldsFor(doc)}
          action={updateLibraryDocument}
          hiddenFields={{ id: doc.id }}
        />
        <DeleteButton
          id={doc.id}
          action={deleteLibraryDocument}
          confirmMessage={`Remove "${doc.title}" from the library? Tenders it is already attached to keep their copy.`}
        />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Document Library</h1>
        <p className="text-muted-foreground">
          Documents you send out with more than one tender. Upload once here, then attach them to any tender by
          ticking a box.
        </p>
      </div>

      <LibraryUploadForm />

      <div className="mt-6">
        <DataTable columns={columns} rows={tableRows} searchable />
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-8 text-center">
          <FileText className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 font-medium">The library is empty</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Upload the documents you send with every tender — the RFQ pack, the standard forms, the conditions of
            contract. A single combined PDF works just as well as separate files.
          </p>
        </div>
      ) : null}
    </div>
  )
}
