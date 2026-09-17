"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

const BID_STATUSES = ["submitted", "under_evaluation", "shortlisted", "rejected", "awarded"] as const

const statusSchema = z.object({
  id: z.string().uuid(),
  tenderId: z.string().uuid(),
  status: z.enum(BID_STATUSES),
})

export async function updateBidStatus(
  id: string,
  status: (typeof BID_STATUSES)[number],
  tenderId: string
): Promise<ActionResult> {
  const parsed = statusSchema.safeParse({ id, status, tenderId })
  if (!parsed.success) return { success: false, error: "Invalid status." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("margaret_bids")
    .update({ status: parsed.data.status, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidatePath(`/admin/tenders/${parsed.data.tenderId}`)
  return { success: true }
}

const scoreSchema = z.object({
  id: z.string().uuid(),
  tenderId: z.string().uuid(),
  technicalScore: z.string().optional().or(z.literal("")),
  financialScore: z.string().optional().or(z.literal("")),
})

export async function updateBidScores(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = scoreSchema.safeParse({
    id: formData.get("id"),
    tenderId: formData.get("tenderId"),
    technicalScore: formData.get("technicalScore") ?? "",
    financialScore: formData.get("financialScore") ?? "",
  })
  if (!parsed.success) return { success: false, error: "Invalid input." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_bids")
    .update({
      technical_score: parsed.data.technicalScore ? Number(parsed.data.technicalScore) : null,
      financial_score: parsed.data.financialScore ? Number(parsed.data.financialScore) : null,
    })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidatePath(`/admin/tenders/${parsed.data.tenderId}`)
  return { success: true }
}

const recordSchema = z.object({
  tenderId: z.string().uuid(),
  supplierId: z.string().uuid("Choose the supplier."),
  bidAmount: z.coerce.number().min(0, "Enter the quoted amount.").max(1_000_000_000),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
})

/**
 * Records a quotation received in a sealed envelope.
 *
 * Suppliers no longer submit through the site: quotations arrive sealed and
 * are opened in public at the closing time. This is how what was read out at
 * that opening gets into the system, so the evaluation, scoring and award
 * steps still have something to work on.
 *
 * Only for suppliers already registered, so the bid is tied to a real,
 * approved company rather than a typed name.
 */
export async function recordBid(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = recordSchema.safeParse({
    tenderId: formData.get("tenderId") ?? "",
    supplierId: formData.get("supplierId") ?? "",
    bidAmount: formData.get("bidAmount") ?? "",
    notes: formData.get("notes") ?? "",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()

  const { error } = await supabase.from("margaret_bids").insert({
    tender_id: parsed.data.tenderId,
    supplier_id: parsed.data.supplierId,
    bid_amount: parsed.data.bidAmount,
    notes: parsed.data.notes || null,
    status: "submitted",
    submitted_at: new Date().toISOString(),
  })

  if (error) {
    const duplicate = error.code === "23505"
    return {
      success: false,
      error: duplicate
        ? "A quotation from that supplier is already recorded for this tender."
        : "You don't have permission to do this.",
    }
  }

  revalidatePath(`/admin/tenders/${parsed.data.tenderId}`)
  return { success: true }
}
