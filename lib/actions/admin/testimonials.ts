"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { resolveImageInput } from "@/lib/actions/admin/storage"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  patientName: z.string().trim().min(2, "Name is required.").max(200),
  quote: z.string().trim().min(2, "Quote is required.").max(2000),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    patientName: formData.get("patientName"),
    quote: formData.get("quote"),
    rating: formData.get("rating") || undefined,
    departmentId: formData.get("departmentId") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/testimonials")
  revalidatePath("/")
}

async function maybeUploadImage(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  return resolveImageInput(supabase, formData, "photo", "gallery", "testimonials")
}

export async function createTestimonial(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const photoUrl = await maybeUploadImage(supabase, formData)

  const { error } = await supabase.from("margaret_testimonials").insert({
    patient_name: parsed.data.patientName,
    quote: parsed.data.quote,
    rating: parsed.data.rating ?? null,
    department_id: parsed.data.departmentId || null,
    photo_url: photoUrl || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateTestimonial(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const photoUrl = await maybeUploadImage(supabase, formData)
  if (photoUrl === null) return { success: false, error: "Image must be a valid file under 10MB." }

  const update: Record<string, unknown> = {
    patient_name: parsed.data.patientName,
    quote: parsed.data.quote,
    rating: parsed.data.rating ?? null,
    department_id: parsed.data.departmentId || null,
    status: parsed.data.status,
  }
  if (photoUrl) update.photo_url = photoUrl

  const { data, error } = await supabase.from("margaret_testimonials").update(update as never).eq("id", parsed.data.id).select("id")
  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_testimonials").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
