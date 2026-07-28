"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  message: z.string().trim().min(2, "Message is required.").max(2000),
  announcementType: z.enum(["info", "warning", "emergency", "success"]),
  linkUrl: z.string().trim().max(500).optional().or(z.literal("")),
  startsAt: z.string().optional().or(z.literal("")),
  endsAt: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    message: formData.get("message"),
    announcementType: formData.get("announcementType") ?? "info",
    linkUrl: formData.get("linkUrl") ?? "",
    startsAt: formData.get("startsAt") ?? "",
    endsAt: formData.get("endsAt") ?? "",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/announcements")
  revalidatePath("/", "layout")
}

export async function createAnnouncement(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_announcements").insert({
    title: parsed.data.title,
    message: parsed.data.message,
    announcement_type: parsed.data.announcementType,
    link_url: parsed.data.linkUrl || null,
    starts_at: parsed.data.startsAt || null,
    ends_at: parsed.data.endsAt || null,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateAnnouncement(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("margaret_announcements")
    .update({
      title: parsed.data.title,
      message: parsed.data.message,
      announcement_type: parsed.data.announcementType,
      link_url: parsed.data.linkUrl || null,
      starts_at: parsed.data.startsAt || null,
      ends_at: parsed.data.endsAt || null,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("margaret_announcements").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
