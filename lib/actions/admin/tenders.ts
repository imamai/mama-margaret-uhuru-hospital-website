"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const tenderSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(300),
  tender_number: z.string().trim().min(1, "Tender number is required.").max(50),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  eligibility: z.string().trim().max(4000).optional().or(z.literal("")),
  closing_date: z.string().min(1, "Closing date is required."),
  opening_date: z.string().optional().or(z.literal("")),
  evaluation_stage: z.enum(["not_started", "technical", "financial", "completed"]),
  status: z.enum(["draft", "published", "closed", "awarded", "cancelled"]),
})

function parse(formData: FormData) {
  return tenderSchema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    tender_number: formData.get("tender_number"),
    description: formData.get("description") ?? "",
    eligibility: formData.get("eligibility") ?? "",
    closing_date: formData.get("closing_date"),
    opening_date: formData.get("opening_date") ?? "",
    evaluation_stage: formData.get("evaluation_stage") ?? "not_started",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/tenders")
  revalidatePath("/tenders")
}

export async function createTender(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_tenders").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    tender_number: parsed.data.tender_number,
    description: parsed.data.description || null,
    eligibility: parsed.data.eligibility || null,
    closing_date: new Date(parsed.data.closing_date).toISOString(),
    opening_date: parsed.data.opening_date ? new Date(parsed.data.opening_date).toISOString() : null,
    evaluation_stage: parsed.data.evaluation_stage,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug/tender number is already in use." }

  revalidate()
  return { success: true }
}

export async function updateTender(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_tenders")
    .update({
      title: parsed.data.title,
      tender_number: parsed.data.tender_number,
      description: parsed.data.description || null,
      eligibility: parsed.data.eligibility || null,
      closing_date: new Date(parsed.data.closing_date).toISOString(),
      opening_date: parsed.data.opening_date ? new Date(parsed.data.opening_date).toISOString() : null,
      evaluation_stage: parsed.data.evaluation_stage,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function deleteTender(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_tenders").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

const clarificationAnswerSchema = z.object({
  id: z.string().uuid(),
  tenderId: z.string().uuid(),
  answer: z.string().trim().min(1, "Please enter an answer."),
})

export async function answerClarification(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = clarificationAnswerSchema.safeParse({
    id: formData.get("id"),
    tenderId: formData.get("tenderId"),
    answer: formData.get("answer"),
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("margaret_tender_clarifications")
    .update({
      answer: parsed.data.answer,
      status: "published",
      answered_by: user?.id ?? null,
      answered_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidatePath(`/admin/tenders/${parsed.data.tenderId}`)
  revalidatePath("/tenders")
  return { success: true }
}

const documentSchema = z.object({
  tenderId: z.string().uuid(),
  title: z.string().trim().min(1, "Title is required.").max(200),
  documentType: z.enum(["tender_document", "addendum", "clarification", "opening_result", "award_notice"]),
})

const MAX_DOC_BYTES = 20 * 1024 * 1024

export async function uploadTenderDocument(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = documentSchema.safeParse({
    tenderId: formData.get("tenderId"),
    title: formData.get("title"),
    documentType: formData.get("documentType") ?? "tender_document",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Please choose a file." }
  if (file.size > MAX_DOC_BYTES) return { success: false, error: "File must be smaller than 20MB." }

  const supabase = await createClient()

  const path = `tenders/${parsed.data.tenderId}/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage
    .from("downloads")
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) return { success: false, error: "You don't have permission to upload documents." }

  const {
    data: { publicUrl },
  } = supabase.storage.from("downloads").getPublicUrl(path)

  const { error } = await supabase.from("margaret_tender_documents").insert({
    tender_id: parsed.data.tenderId,
    title: parsed.data.title,
    file_url: publicUrl,
    document_type: parsed.data.documentType,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidatePath(`/admin/tenders/${parsed.data.tenderId}`)
  revalidatePath("/tenders")
  return { success: true }
}

export async function deleteTenderDocument(id: string, tenderId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_tender_documents").delete().eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidatePath(`/admin/tenders/${tenderId}`)
  revalidatePath("/tenders")
  return { success: true }
}

const awardSchema = z.object({
  tenderId: z.string().uuid(),
  awardedSupplierName: z.string().trim().min(2, "Supplier name is required.").max(200),
  awardAmount: z.string().optional().or(z.literal("")),
  awardedAt: z.string().min(1, "Award date is required."),
})

export async function recordTenderAward(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = awardSchema.safeParse({
    tenderId: formData.get("tenderId"),
    awardedSupplierName: formData.get("awardedSupplierName"),
    awardAmount: formData.get("awardAmount") ?? "",
    awardedAt: formData.get("awardedAt"),
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error: awardError } = await supabase.from("margaret_tender_awards").insert({
    tender_id: parsed.data.tenderId,
    awarded_supplier_name: parsed.data.awardedSupplierName,
    award_amount: parsed.data.awardAmount ? Number(parsed.data.awardAmount) : null,
    awarded_at: parsed.data.awardedAt,
  })

  if (awardError) return { success: false, error: "You don't have permission to do this." }

  const { data: awarded, error: statusError } = await supabase
    .from("margaret_tenders")
    .update({ status: "awarded" })
    .eq("id", parsed.data.tenderId)
    .select("id")

  if (statusError || !awarded?.length) return { success: false, error: "You don't have permission to do this." }

  revalidatePath(`/admin/tenders/${parsed.data.tenderId}`)
  revalidatePath("/tenders")
  return { success: true }
}
