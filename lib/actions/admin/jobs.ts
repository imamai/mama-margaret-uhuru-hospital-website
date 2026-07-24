"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const CONTRACT_TYPES = ["full_time", "part_time", "contract", "internship", "locum"] as const

const jobSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  location: z.string().trim().min(1, "Location is required.").max(200),
  contract_type: z.enum(CONTRACT_TYPES),
  application_deadline: z.string().min(1, "Deadline is required."),
  positions_available: z.coerce.number().int().min(1).max(999),
  salary_range: z.string().trim().max(100).optional().or(z.literal("")),
  qualifications: z.string().trim().max(4000).optional().or(z.literal("")),
  experience_required: z.string().trim().max(200).optional().or(z.literal("")),
  responsibilities: z.string().trim().max(4000).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "closed", "archived"]),
})

function parse(formData: FormData) {
  return jobSchema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    location: formData.get("location"),
    contract_type: formData.get("contract_type") ?? "full_time",
    application_deadline: formData.get("application_deadline"),
    positions_available: formData.get("positions_available") || "1",
    salary_range: formData.get("salary_range") ?? "",
    qualifications: formData.get("qualifications") ?? "",
    experience_required: formData.get("experience_required") ?? "",
    responsibilities: formData.get("responsibilities") ?? "",
    description: formData.get("description") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/jobs")
  revalidatePath("/careers")
}

export async function createJob(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_jobs").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    location: parsed.data.location,
    contract_type: parsed.data.contract_type,
    application_deadline: parsed.data.application_deadline,
    positions_available: parsed.data.positions_available,
    salary_range: parsed.data.salary_range || null,
    qualifications: parsed.data.qualifications || null,
    experience_required: parsed.data.experience_required || null,
    responsibilities: parsed.data.responsibilities || null,
    description: parsed.data.description || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }

  revalidate()
  return { success: true }
}

export async function updateJob(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("margaret_jobs")
    .update({
      title: parsed.data.title,
      location: parsed.data.location,
      contract_type: parsed.data.contract_type,
      application_deadline: parsed.data.application_deadline,
      positions_available: parsed.data.positions_available,
      salary_range: parsed.data.salary_range || null,
      qualifications: parsed.data.qualifications || null,
      experience_required: parsed.data.experience_required || null,
      responsibilities: parsed.data.responsibilities || null,
      description: parsed.data.description || null,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_jobs").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}
