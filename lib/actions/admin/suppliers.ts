"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

const STATUSES = ["pending", "approved", "rejected", "suspended"] as const

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(STATUSES),
})

export async function updateSupplierStatus(id: string, status: (typeof STATUSES)[number]): Promise<ActionResult> {
  const parsed = schema.safeParse({ id, status })
  if (!parsed.success) return { success: false, error: "Invalid status." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("margaret_suppliers")
    .update({ status: parsed.data.status, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .select("id")

  if (error || !data?.length) return { success: false, error: "You don't have permission to do this." }

  revalidatePath("/admin/suppliers")
  return { success: true }
}
