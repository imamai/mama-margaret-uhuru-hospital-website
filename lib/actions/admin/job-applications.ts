"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

const APPLICATION_STATUSES = [
  "submitted",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "rejected",
  "hired",
] as const

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(APPLICATION_STATUSES),
  jobId: z.string().uuid(),
})

export async function updateApplicationStatus(
  id: string,
  status: (typeof APPLICATION_STATUSES)[number],
  jobId: string
): Promise<ActionResult> {
  const parsed = statusSchema.safeParse({ id, status, jobId })
  if (!parsed.success) return { success: false, error: "Invalid status." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("margaret_job_applications")
    .update({
      status: parsed.data.status,
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidatePath(`/admin/jobs/${parsed.data.jobId}/applications`)
  return { success: true }
}
