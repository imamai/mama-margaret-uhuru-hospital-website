"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import type { ActionResult } from "@/lib/actions/forms"

const doctorSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  full_name: z.string().trim().min(2, "Full name is required.").max(200),
  specialization: z.string().trim().min(2, "Specialization is required.").max(200),
  department_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().max(100).optional().or(z.literal("")),
  biography: z.string().trim().max(4000).optional().or(z.literal("")),
  years_experience: z.coerce.number().int().min(0).max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email address.").optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  qualifications: z.string().trim().max(2000).optional().or(z.literal("")),
  languages: z.string().trim().max(500).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().max(500).optional().or(z.literal("")),
  twitterUrl: z.string().trim().max(500).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return doctorSchema.safeParse({
    id: formData.get("id") ?? "",
    full_name: formData.get("full_name"),
    specialization: formData.get("specialization"),
    department_id: formData.get("department_id") ?? "",
    title: formData.get("title") ?? "",
    biography: formData.get("biography") ?? "",
    years_experience: formData.get("years_experience") || "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    qualifications: formData.get("qualifications") ?? "",
    languages: formData.get("languages") ?? "",
    linkedinUrl: formData.get("linkedinUrl") ?? "",
    twitterUrl: formData.get("twitterUrl") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

/** Splits a newline-separated textarea into a trimmed, non-empty string array. */
function toList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function toLanguageList(value: string): string[] {
  return value
    .split(",")
    .map((lang) => lang.trim())
    .filter(Boolean)
}

function revalidate() {
  revalidatePath("/admin/doctors")
  revalidatePath("/doctors")
}

async function maybeUploadPhoto(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("photo")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (!file.type.startsWith("image/")) return null
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "avatars", "doctors", file)
}

export async function createDoctor(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const photoUrl = await maybeUploadPhoto(supabase, formData)
  if (photoUrl === null) return { success: false, error: "Photo must be a valid image under 10MB." }

  const { error } = await supabase.from("margaret_doctors").insert({
    full_name: parsed.data.full_name,
    slug: slugify(parsed.data.full_name),
    specialization: parsed.data.specialization,
    department_id: parsed.data.department_id || null,
    title: parsed.data.title || null,
    biography: parsed.data.biography || null,
    years_experience: parsed.data.years_experience || null,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    photo_url: photoUrl || null,
    qualifications: toList(parsed.data.qualifications ?? ""),
    languages: toLanguageList(parsed.data.languages ?? ""),
    linkedin_url: parsed.data.linkedinUrl || null,
    twitter_url: parsed.data.twitterUrl || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }

  revalidate()
  return { success: true }
}

export async function updateDoctor(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const photoUrl = await maybeUploadPhoto(supabase, formData)
  if (photoUrl === null) return { success: false, error: "Photo must be a valid image under 10MB." }

  const update: Record<string, unknown> = {
    full_name: parsed.data.full_name,
    specialization: parsed.data.specialization,
    department_id: parsed.data.department_id || null,
    title: parsed.data.title || null,
    biography: parsed.data.biography || null,
    years_experience: parsed.data.years_experience || null,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    qualifications: toList(parsed.data.qualifications ?? ""),
    languages: toLanguageList(parsed.data.languages ?? ""),
    linkedin_url: parsed.data.linkedinUrl || null,
    twitter_url: parsed.data.twitterUrl || null,
    status: parsed.data.status,
  }
  if (photoUrl) update.photo_url = photoUrl

  const { error } = await supabase.from("margaret_doctors").update(update as never).eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function deleteDoctor(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_doctors").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}
