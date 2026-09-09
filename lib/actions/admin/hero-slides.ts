"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { resolveImageInput } from "@/lib/actions/admin/storage"
import type { ActionResult } from "@/lib/actions/forms"

const FOCAL_POINTS = [
  "left top", "top", "right top",
  "left", "center", "right",
  "left bottom", "bottom", "right bottom",
] as const

const heroSlideSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  subtitle: z.string().trim().max(500).optional().or(z.literal("")),
  ctaLabel: z.string().trim().max(60).optional().or(z.literal("")),
  ctaUrl: z.string().trim().max(500).optional().or(z.literal("")),
  focalPoint: z.enum(FOCAL_POINTS),
  status: z.enum(["draft", "published", "archived"]),
})

function parse(formData: FormData) {
  return heroSlideSchema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    subtitle: formData.get("subtitle") ?? "",
    ctaLabel: formData.get("ctaLabel") ?? "",
    ctaUrl: formData.get("ctaUrl") ?? "",
    focalPoint: formData.get("focalPoint") ?? "center",
    status: formData.get("status") ?? "draft",
  })
}

function revalidate() {
  revalidatePath("/admin/hero-slides")
  revalidatePath("/")
}

export async function createHeroSlide(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()

  const imageUrl = await resolveImageInput(supabase, formData, "image", "hero-media", "slides")
  if (!imageUrl) return { success: false, error: "Please choose an image file or paste an image URL." }

  const { data: last } = await supabase
    .from("margaret_hero_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from("margaret_hero_slides").insert({
    title: parsed.data.title,
    subtitle: parsed.data.subtitle || null,
    image_url: imageUrl,
    cta_label: parsed.data.ctaLabel || null,
    cta_url: parsed.data.ctaUrl || null,
    focal_point: parsed.data.focalPoint,
    status: parsed.data.status,
    sort_order: (last?.sort_order ?? 0) + 1,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function updateHeroSlide(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()

  const update: Record<string, unknown> = {
    title: parsed.data.title,
    subtitle: parsed.data.subtitle || null,
    cta_label: parsed.data.ctaLabel || null,
    cta_url: parsed.data.ctaUrl || null,
    focal_point: parsed.data.focalPoint,
    status: parsed.data.status,
  }

  const imageUrl = await resolveImageInput(supabase, formData, "image", "hero-media", "slides")
  if (imageUrl === null) return { success: false, error: "Image must be a valid file under 10MB or a valid URL." }
  if (imageUrl) update.image_url = imageUrl

  const { data, error } = await supabase.from("margaret_hero_slides").update(update as never).eq("id", parsed.data.id).select("id")
  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_hero_slides")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

async function swapWithNeighbor(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: slides } = await supabase
    .from("margaret_hero_slides")
    .select("id, sort_order")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })

  if (!slides) return { success: false, error: "Could not load slides." }

  const index = slides.findIndex((s) => s.id === id)
  const neighborIndex = direction === "up" ? index - 1 : index + 1
  if (index === -1 || neighborIndex < 0 || neighborIndex >= slides.length) {
    return { success: true } // already at the edge, nothing to do
  }

  const current = slides[index]
  const neighbor = slides[neighborIndex]

  const [
    { data: d1, error: err1 },
    { data: d2, error: err2 },
  ] = await Promise.all([
    supabase.from("margaret_hero_slides").update({ sort_order: neighbor.sort_order }).eq("id", current.id).select("id"),
    supabase.from("margaret_hero_slides").update({ sort_order: current.sort_order }).eq("id", neighbor.id).select("id"),
  ])

  if (err1 || err2 || !d1?.length || !d2?.length) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}

export async function moveHeroSlideUp(id: string) {
  return swapWithNeighbor(id, "up")
}

export async function moveHeroSlideDown(id: string) {
  return swapWithNeighbor(id, "down")
}
