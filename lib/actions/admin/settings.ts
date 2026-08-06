"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"
import { MAX_UPLOAD_BYTES, uploadPublicFile } from "@/lib/actions/admin/storage"

async function upsertSettings(entries: { key: string; value: unknown }[]): Promise<ActionResult> {
  const supabase = await createClient()

  for (const entry of entries) {
    const { error } = await supabase
      .from("margaret_settings")
      .update({ setting_value: entry.value as never })
      .eq("setting_key", entry.key)

    if (error) {
      console.error(`Failed to update setting "${entry.key}":`, error)
      return { success: false, error: "You don't have permission to change settings." }
    }
  }

  revalidatePath("/", "layout")
  revalidatePath("/admin/settings")
  return { success: true }
}

const generalSchema = z.object({
  hospital_name: z.string().trim().min(2).max(200),
  hospital_short_name: z.string().trim().min(1).max(50),
  mission: z.string().trim().max(2000).optional().or(z.literal("")),
  vision: z.string().trim().max(2000).optional().or(z.literal("")),
  emergency_phone: z.string().trim().min(1).max(30),
  ambulance_phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
})

export async function updateGeneralSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = generalSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  return upsertSettings([
    { key: "hospital_name", value: parsed.data.hospital_name },
    { key: "hospital_short_name", value: parsed.data.hospital_short_name },
    { key: "mission", value: parsed.data.mission || "" },
    { key: "vision", value: parsed.data.vision || "" },
    { key: "emergency_phone", value: parsed.data.emergency_phone },
    { key: "ambulance_phone", value: parsed.data.ambulance_phone || "" },
    { key: "address", value: parsed.data.address || "" },
  ])
}

const brandingSchema = z.object({
  primary: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #1496E8"),
  deep: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #0D5EA6"),
  accent: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #19B5FE"),
  dark_grey: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  light_grey: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
})

async function getSettingValue(supabase: Awaited<ReturnType<typeof createClient>>, key: string): Promise<string | null> {
  const { data, error } = await supabase.from("margaret_settings").select("setting_value").eq("setting_key", key).maybeSingle()
  if (error || !data?.setting_value) return null
  return typeof data.setting_value === "string" ? data.setting_value : null
}

async function resolveAssetUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  fieldName: string,
  existingValue: string | null
): Promise<string> {
  const rawValue = formData.get(fieldName)

  if (rawValue instanceof File) {
    const file = rawValue
    if (!file.size) return existingValue ?? ""
    if (file.size > MAX_UPLOAD_BYTES) return existingValue ?? ""

    const uploadedUrl = await uploadPublicFile(supabase, "gallery", "branding", file)
    return uploadedUrl ?? existingValue ?? ""
  }

  if (typeof rawValue === "string") {
    const trimmedValue = rawValue.trim()
    return trimmedValue || existingValue || ""
  }

  return existingValue ?? ""
}

export async function updateBrandingSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const payload = Object.fromEntries(
    Array.from(formData.entries())
      .filter(([, value]) => !(value instanceof File))
      .map(([key, value]) => [key, typeof value === "string" ? value : String(value)])
  )

  const parsed = brandingSchema.safeParse(payload)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const existingLogoUrl = await getSettingValue(supabase, "logo_url")
  const existingFaviconUrl = await getSettingValue(supabase, "favicon_url")
  const logoUrl = await resolveAssetUrl(supabase, formData, "logo_url", existingLogoUrl)
  const faviconUrl = await resolveAssetUrl(supabase, formData, "favicon_url", existingFaviconUrl)

  return upsertSettings([
    {
      key: "brand_colors",
      value: {
        primary: parsed.data.primary,
        deep: parsed.data.deep,
        accent: parsed.data.accent,
        dark_grey: parsed.data.dark_grey,
        light_grey: parsed.data.light_grey,
      },
    },
    { key: "logo_url", value: logoUrl },
    { key: "favicon_url", value: faviconUrl },
  ])
}

const socialSchema = z.object({
  facebook: z.string().trim().url().optional().or(z.literal("")),
  twitter: z.string().trim().url().optional().or(z.literal("")),
  instagram: z.string().trim().url().optional().or(z.literal("")),
  linkedin: z.string().trim().url().optional().or(z.literal("")),
  youtube: z.string().trim().url().optional().or(z.literal("")),
})

export async function updateSocialSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = socialSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  return upsertSettings([{ key: "social_links", value: parsed.data }])
}

const seoSchema = z.object({
  title: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  og_image: z.string().trim().url().optional().or(z.literal("")),
})

export async function updateSeoSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = seoSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  return upsertSettings([
    {
      key: "seo_defaults",
      value: { title: parsed.data.title || "", description: parsed.data.description || "", og_image: parsed.data.og_image || "" },
    },
  ])
}

const integrationsSchema = z.object({
  google_analytics_id: z.string().trim().max(50).optional().or(z.literal("")),
  google_maps_embed_url: z.string().trim().max(2000).optional().or(z.literal("")),
})

export async function updateIntegrationSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = integrationsSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  return upsertSettings([
    { key: "google_analytics_id", value: parsed.data.google_analytics_id || "" },
    { key: "google_maps_embed_url", value: parsed.data.google_maps_embed_url || "" },
  ])
}
