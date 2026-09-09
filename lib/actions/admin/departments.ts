"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import { resolveImageInput } from "@/lib/actions/admin/storage"
import type { ActionResult } from "@/lib/actions/forms"

const departmentSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Name is required.").max(200),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email address.").optional().or(z.literal("")),
  operatingHours: z.string().trim().max(1000).optional().or(z.literal("")),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(500).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return departmentSchema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    location: formData.get("location") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    operatingHours: formData.get("operatingHours") ?? "",
    seoTitle: formData.get("seoTitle") ?? "",
    seoDescription: formData.get("seoDescription") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

/** Parses "Day: Hours" lines (one per line) into the { day: hours } shape the department page reads. */
function parseOperatingHours(value: string): Record<string, string> {
  const hours: Record<string, string> = {}
  for (const line of value.split("\n")) {
    const [day, ...rest] = line.split(":")
    const label = day?.trim()
    const time = rest.join(":").trim()
    if (label && time) hours[label] = time
  }
  return hours
}

function revalidate() {
  revalidatePath("/admin/departments")
  revalidatePath("/departments")
}

async function maybeUploadBanner(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  return resolveImageInput(supabase, formData, "bannerImage", "department-media", "departments")
}

export async function createDepartment(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const bannerUrl = await maybeUploadBanner(supabase, formData)
  if (bannerUrl === null) return { success: false, error: "Banner image must be a valid image under 10MB." }

  const { error } = await supabase.from("margaret_departments").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
    location: parsed.data.location || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    banner_image_url: bannerUrl || null,
    operating_hours: parseOperatingHours(parsed.data.operatingHours ?? ""),
    seo_title: parsed.data.seoTitle || null,
    seo_description: parsed.data.seoDescription || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }

  revalidate()
  return { success: true }
}

export async function updateDepartment(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const bannerUrl = await maybeUploadBanner(supabase, formData)
  if (bannerUrl === null) return { success: false, error: "Banner image must be a valid image under 10MB." }

  const update: Record<string, unknown> = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    location: parsed.data.location || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    operating_hours: parseOperatingHours(parsed.data.operatingHours ?? ""),
    seo_title: parsed.data.seoTitle || null,
    seo_description: parsed.data.seoDescription || null,
    status: parsed.data.status,
  }
  if (bannerUrl) update.banner_image_url = bannerUrl

  const { data, error } = await supabase
    .from("margaret_departments")
    .update(update as never)
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function deleteDepartment(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_departments").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}
