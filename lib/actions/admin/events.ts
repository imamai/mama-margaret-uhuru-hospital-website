"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import { slugify } from "@/lib/utils"
import type { ActionResult } from "@/lib/actions/forms"

const EVENT_TYPES = ["conference", "medical_camp", "training", "webinar", "event"] as const

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  eventType: z.enum(EVENT_TYPES),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  location: z.string().trim().max(300).optional().or(z.literal("")),
  isVirtual: z.enum(["true", "false"]).default("false"),
  virtualLink: z.string().trim().max(500).optional().or(z.literal("")),
  startsAt: z.string().min(1, "Start date/time is required."),
  endsAt: z.string().optional().or(z.literal("")),
  registrationRequired: z.enum(["true", "false"]).default("false"),
  capacity: z.coerce.number().int().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    eventType: formData.get("eventType") ?? "event",
    description: formData.get("description") ?? "",
    location: formData.get("location") ?? "",
    isVirtual: formData.get("isVirtual") === "true" ? "true" : "false",
    virtualLink: formData.get("virtualLink") ?? "",
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") ?? "",
    registrationRequired: formData.get("registrationRequired") === "true" ? "true" : "false",
    capacity: formData.get("capacity") || undefined,
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/events")
  revalidatePath("/events")
}

async function maybeUploadImage(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("featuredImage")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (!file.type.startsWith("image/")) return null
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "gallery", "events", file)
}

export async function createEvent(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)

  const { error } = await supabase.from("margaret_events").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    event_type: parsed.data.eventType,
    description: parsed.data.description || null,
    location: parsed.data.location || null,
    is_virtual: parsed.data.isVirtual === "true",
    virtual_link: parsed.data.virtualLink || null,
    starts_at: parsed.data.startsAt,
    ends_at: parsed.data.endsAt || null,
    registration_required: parsed.data.registrationRequired === "true",
    capacity: parsed.data.capacity ?? null,
    featured_image_url: imageUrl || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this, or the slug is already in use." }
  revalidate()
  return { success: true }
}

export async function updateEvent(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const imageUrl = await maybeUploadImage(supabase, formData)
  if (imageUrl === null) return { success: false, error: "Image must be a valid file under 10MB." }

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    event_type: parsed.data.eventType,
    description: parsed.data.description || null,
    location: parsed.data.location || null,
    is_virtual: parsed.data.isVirtual === "true",
    virtual_link: parsed.data.virtualLink || null,
    starts_at: parsed.data.startsAt,
    ends_at: parsed.data.endsAt || null,
    registration_required: parsed.data.registrationRequired === "true",
    capacity: parsed.data.capacity ?? null,
    status: parsed.data.status,
  }
  if (imageUrl) update.featured_image_url = imageUrl

  const { error } = await supabase.from("margaret_events").update(update as never).eq("id", parsed.data.id)
  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_events").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
