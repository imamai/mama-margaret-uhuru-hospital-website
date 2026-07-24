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

  const { error } = await supabase
    .from("margaret_bids")
    .update({ status: parsed.data.status, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString() })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }

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
  const { error } = await supabase
    .from("margaret_bids")
    .update({
      technical_score: parsed.data.technicalScore ? Number(parsed.data.technicalScore) : null,
      financial_score: parsed.data.financialScore ? Number(parsed.data.financialScore) : null,
    })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidatePath(`/admin/tenders/${parsed.data.tenderId}`)
  return { success: true }
}
