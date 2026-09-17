"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

/**
 * The reusable document library.
 *
 * Procurement sends the same forms out with tender after tender. They are
 * uploaded here once and attached by ticking a box, so nobody hunts through
 * their Downloads folder for SD2 again.
 *
 * Attaching copies the file's address onto the tender. A published tender has
 * to stay exactly as published, so replacing a form in the library next year
 * cannot rewrite what this year's bidders were sent.
 */

const MAX_DOC_BYTES = 20 * 1024 * 1024

const CATEGORIES = ["rfq_form", "contract", "policy", "template", "other"] as const

const uploadSchema = z.object({
  title: z.string().trim().min(1, "Give the document a title.").max(200),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.enum(CATEGORIES).default("rfq_form"),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
})

function revalidate() {
  revalidatePath("/admin/document-library")
}

/** Adds a file to the library. Nothing is attached to a tender by this. */
export async function uploadLibraryDocument(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = uploadSchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    category: formData.get("category") ?? "rfq_form",
    sortOrder: formData.get("sortOrder") ?? 0,
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Please choose a file." }
  if (file.size > MAX_DOC_BYTES) return { success: false, error: "File must be smaller than 20MB." }

  const supabase = await createClient()

  // A new path every time, never an overwrite: tenders already published point
  // at the old address, and those must keep resolving to what was published.
  const path = `library/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage
    .from("downloads")
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) return { success: false, error: "You don't have permission to upload documents." }

  const {
    data: { publicUrl },
  } = supabase.storage.from("downloads").getPublicUrl(path)

  const { error } = await supabase.from("margaret_document_library").insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    file_url: publicUrl,
    file_name: file.name,
    file_size: file.size,
    content_type: file.type || null,
    category: parsed.data.category,
    sort_order: parsed.data.sortOrder,
  })

  if (error) return { success: false, error: "We couldn't save that document." }

  revalidate()
  return { success: true }
}

const updateSchema = uploadSchema.extend({
  id: z.string().uuid(),
  status: z.enum(["active", "inactive"]).default("active"),
})

/**
 * Edits a library document, and replaces its file if a new one is chosen.
 *
 * Replacing is safe: a tender already carrying this document holds its own
 * copy of the file's address, so what was published with it does not change.
 */
export async function updateLibraryDocument(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = updateSchema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    category: formData.get("category") ?? "rfq_form",
    sortOrder: formData.get("sortOrder") ?? 0,
    status: formData.get("status") ?? "active",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()

  const fields: {
    title: string
    description: string | null
    category: string
    sort_order: number
    status: string
    updated_at: string
    file_url?: string
    file_name?: string
    file_size?: number
    content_type?: string | null
  } = {
    title: parsed.data.title,
    description: parsed.data.description || null,
    category: parsed.data.category,
    sort_order: parsed.data.sortOrder,
    status: parsed.data.status,
    updated_at: new Date().toISOString(),
  }

  const file = formData.get("file")
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_DOC_BYTES) return { success: false, error: "File must be smaller than 20MB." }

    const path = `library/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("downloads")
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) return { success: false, error: "You don't have permission to upload documents." }

    const {
      data: { publicUrl },
    } = supabase.storage.from("downloads").getPublicUrl(path)

    fields.file_url = publicUrl
    fields.file_name = file.name
    fields.file_size = file.size
    fields.content_type = file.type || null
  }

  const { data, error } = await supabase
    .from("margaret_document_library")
    .update(fields)
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

/** Soft delete: tenders that already carry a copy are unaffected. */
export async function deleteLibraryDocument(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("margaret_document_library")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

const attachSchema = z.object({
  tenderId: z.string().uuid(),
  isRequiredReturn: z.enum(["true", "false"]).default("true"),
})

/**
 * Attaches the ticked library documents to a tender.
 *
 * Already-attached documents are skipped rather than duplicated, so "select
 * all" can be pressed twice without the supplier seeing two of everything.
 *
 * They arrive marked as forms to complete and return by default, because that
 * is what the standard pack is; the checkbox turns that off for a document
 * that is only to be read, such as the conditions of contract.
 */
export async function attachLibraryDocuments(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = attachSchema.safeParse({
    tenderId: formData.get("tenderId") ?? "",
    isRequiredReturn: formData.get("isRequiredReturn") ?? "true",
  })
  if (!parsed.success) return { success: false, error: "Missing the tender." }

  const ids: string[] = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("doc:") && value) ids.push(key.slice(4))
  }
  if (ids.length === 0) return { success: false, error: "Choose at least one document." }

  const supabase = await createClient()

  const { data: docs, error: readError } = await supabase
    .from("margaret_document_library")
    .select("id, title, file_url, sort_order")
    .in("id", ids)
    .is("deleted_at", null)

  if (readError || !docs?.length) return { success: false, error: "We couldn't read those documents." }

  const { data: already } = await supabase
    .from("margaret_tender_documents")
    .select("library_document_id")
    .eq("tender_id", parsed.data.tenderId)
    .not("library_document_id", "is", null)

  const have = new Set((already ?? []).map((row) => row.library_document_id as string))
  const toAdd = docs.filter((doc) => !have.has(doc.id as string))

  if (toAdd.length === 0) {
    return { success: true, warning: "Those documents are already attached to this tender." }
  }

  const { error } = await supabase.from("margaret_tender_documents").insert(
    toAdd.map((doc) => ({
      tender_id: parsed.data.tenderId,
      title: doc.title as string,
      file_url: doc.file_url as string,
      library_document_id: doc.id as string,
      document_type: "tender_document",
      is_required_return: parsed.data.isRequiredReturn === "true",
      sort_order: (doc.sort_order as number) ?? 0,
    }))
  )

  if (error) return { success: false, error: "We couldn't attach those documents." }

  revalidatePath(`/admin/tenders/${parsed.data.tenderId}`)
  revalidatePath("/tenders")
  revalidatePath("/suppliers/dashboard")
  return { success: true }
}
