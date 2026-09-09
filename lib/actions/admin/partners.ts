"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"
import type { ActionResult } from "@/lib/actions/forms"

const PARTNER_TYPES = ["general", "academic", "ngo", "government", "corporate"] as const

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Name is required.").max(200),
  websiteUrl: z.string().trim().max(500).optional().or(z.literal("")),
  partnerType: z.enum(PARTNER_TYPES),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["active", "inactive"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    websiteUrl: formData.get("websiteUrl") ?? "",
    partnerType: formData.get("partnerType") ?? "general",
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status") ?? "active",
  })
}

function revalidate() {
  revalidatePath("/admin/partners")
  revalidatePath("/")
}

async function maybeUploadLogo(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData): Promise<string | null | undefined> {
  const file = formData.get("logo")
  if (!(file instanceof File) || file.size === 0) return undefined
  if (!file.type.startsWith("image/")) return null
  if (file.size > MAX_UPLOAD_BYTES) return null
  return uploadPublicFile(supabase, "gallery", "partners", file)
}

export async function createPartner(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const logoUrl = await maybeUploadLogo(supabase, formData)

  const { error } = await supabase.from("margaret_partners").insert({
    name: parsed.data.name,
    website_url: parsed.data.websiteUrl || null,
    partner_type: parsed.data.partnerType,
    logo_url: logoUrl || null,
    sort_order: parsed.data.sortOrder,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updatePartner(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const logoUrl = await maybeUploadLogo(supabase, formData)
  if (logoUrl === null) return { success: false, error: "Logo must be a valid image under 10MB." }

  const update: Record<string, unknown> = {
    name: parsed.data.name,
    website_url: parsed.data.websiteUrl || null,
    partner_type: parsed.data.partnerType,
    sort_order: parsed.data.sortOrder,
    status: parsed.data.status,
  }
  if (logoUrl) update.logo_url = logoUrl

  const { data, error } = await supabase.from("margaret_partners").update(update as never).eq("id", parsed.data.id).select("id")
  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_partners").delete().eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
