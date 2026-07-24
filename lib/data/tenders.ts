import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listTenders = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_tenders")
    .select("id, title, slug, tender_number, closing_date, status")
    .eq("status", "published")
    .order("closing_date", { ascending: false })
  return data ?? []
})

export const getTenderBySlug = cache(async (slug: string) => {
  const supabase = await createClient()

  const { data: tender } = await supabase
    .from("margaret_tenders")
    .select(
      "id, title, slug, tender_number, category_id, description, eligibility, closing_date, opening_date, evaluation_stage, status"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (!tender) return null

  const [{ data: documents }, { data: clarifications }, { data: award }] = await Promise.all([
    supabase
      .from("margaret_tender_documents")
      .select("id, title, file_url, document_type")
      .eq("tender_id", tender.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("margaret_tender_clarifications")
      .select("id, question, answer, answered_at")
      .eq("tender_id", tender.id)
      .eq("status", "published")
      .order("created_at", { ascending: true }),
    supabase
      .from("margaret_tender_awards")
      .select("id, awarded_supplier_name, award_amount, award_notice_url, awarded_at")
      .eq("tender_id", tender.id)
      .maybeSingle(),
  ])

  return {
    ...tender,
    documents: documents ?? [],
    clarifications: clarifications ?? [],
    award: award ?? null,
  }
})

export const isTenderOpen = (closingDate: string) => new Date(closingDate) >= new Date()
