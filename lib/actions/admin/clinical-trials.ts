"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  trialPhase: z.string().trim().max(50).optional().or(z.literal("")),
  conditionStudied: z.string().trim().max(200).optional().or(z.literal("")),
  principalInvestigator: z.string().trim().max(200).optional().or(z.literal("")),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  eligibilityCriteria: z.string().trim().max(4000).optional().or(z.literal("")),
  contactEmail: z.string().trim().email("Invalid email.").optional().or(z.literal("")),
  startsAt: z.string().optional().or(z.literal("")),
  endsAt: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "recruiting", "closed", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    trialPhase: formData.get("trialPhase") ?? "",
    conditionStudied: formData.get("conditionStudied") ?? "",
    principalInvestigator: formData.get("principalInvestigator") ?? "",
    departmentId: formData.get("departmentId") ?? "",
    description: formData.get("description") ?? "",
    eligibilityCriteria: formData.get("eligibilityCriteria") ?? "",
    contactEmail: formData.get("contactEmail") ?? "",
    startsAt: formData.get("startsAt") ?? "",
    endsAt: formData.get("endsAt") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/clinical-trials")
  revalidatePath("/research")
}

export async function createClinicalTrial(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_clinical_trials").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    trial_phase: parsed.data.trialPhase || null,
    condition_studied: parsed.data.conditionStudied || null,
    principal_investigator: parsed.data.principalInvestigator || null,
    department_id: parsed.data.departmentId || null,
    description: parsed.data.description || null,
    eligibility_criteria: parsed.data.eligibilityCriteria || null,
    contact_email: parsed.data.contactEmail || null,
    starts_at: parsed.data.startsAt || null,
    ends_at: parsed.data.endsAt || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updateClinicalTrial(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_clinical_trials")
    .update({
      title: parsed.data.title,
      trial_phase: parsed.data.trialPhase || null,
      condition_studied: parsed.data.conditionStudied || null,
      principal_investigator: parsed.data.principalInvestigator || null,
      department_id: parsed.data.departmentId || null,
      description: parsed.data.description || null,
      eligibility_criteria: parsed.data.eligibilityCriteria || null,
      contact_email: parsed.data.contactEmail || null,
      starts_at: parsed.data.startsAt || null,
      ends_at: parsed.data.endsAt || null,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteClinicalTrial(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_clinical_trials").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
