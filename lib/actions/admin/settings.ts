"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

async function upsertSettings(entries: { key: string; value: unknown }[]): Promise<ActionResult> {
  const supabase = await createClient()

  for (const entry of entries) {
    const { error } = await supabase
      .from("margaret_settings")
      .update({ setting_value: entry.value as never })
      .eq("setting_key", entry.key)

    if (error) return { success: false, error: "You don't have permission to change settings." }
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
  logo_url: z.string().trim().url().optional().or(z.literal("")),
  favicon_url: z.string().trim().url().optional().or(z.literal("")),
})

export async function updateBrandingSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = brandingSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

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
    { key: "logo_url", value: parsed.data.logo_url || null },
    { key: "favicon_url", value: parsed.data.favicon_url || null },
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
