import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listSupplierCategories = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_supplier_categories")
    .select("id, name, slug")
    .eq("status", "active")
    .order("name", { ascending: true })
  return data ?? []
})

export async function getCurrentSupplier() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: supplier } = await supabase
    .from("margaret_suppliers")
    .select("id, company_name, contact_person, email, phone, status, category_id")
    .eq("user_id", user.id)
    .maybeSingle()

  return supplier
}
