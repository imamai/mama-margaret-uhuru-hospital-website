"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required.").max(200),
  body: z.string().trim().max(2000).optional().or(z.literal("")),
  links: z.string().trim().max(4000).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["active", "inactive"]),
})

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title"),
    body: formData.get("body") ?? "",
    links: formData.get("links") ?? "",
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status") ?? "active",
  })
}

/** Parses "Label | /url" lines (one per line) into the { label, url }[] shape components/layout/footer.tsx expects. */
function parseLinks(value: string): { label: string; url: string }[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((part) => part.trim())
      return { label, url }
    })
    .filter((link) => link.label && link.url)
}

function buildContent(data: z.infer<typeof schema>) {
  const links = parseLinks(data.links ?? "")
  return {
    ...(data.body ? { body: data.body } : {}),
    ...(links.length > 0 ? { links } : {}),
  }
}

function revalidate() {
  revalidatePath("/admin/footer-sections")
  revalidatePath("/", "layout")
}

export async function createFooterSection(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_footer_sections").insert({
    title: parsed.data.title,
    content: buildContent(parsed.data) as never,
    sort_order: parsed.data.sortOrder,
    status: parsed.data.status,
  })

  if (error) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function updateFooterSection(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = parse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  if (!parsed.data.id) return { success: false, error: "Missing record id." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("margaret_footer_sections")
    .update({
      title: parsed.data.title,
      content: buildContent(parsed.data) as never,
      sort_order: parsed.data.sortOrder,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}

export async function deleteFooterSection(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("margaret_footer_sections").delete().eq("id", id).select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }
  revalidate()
  return { success: true }
}
