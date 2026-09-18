"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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

const passwordSchema = z.object({
  supplierId: z.string().uuid(),
  password: z.string().min(10, "The new password must be at least 10 characters."),
})

/**
 * Sets a supplier's password directly, for procurement to use on the phone.
 *
 * The self-service reset at /suppliers/forgot-password is the normal route,
 * but it depends on email actually arriving. Until SMTP is configured -- and
 * for the supplier who never receives it anyway -- somebody has to be able to
 * unblock a bidder before a tender closes.
 *
 * Follows the same two rules as every other use of the service-role key: the
 * caller's own permission is checked first, on their own client, and the key
 * is used only to set a password, never to delete an account. The target is
 * looked up in margaret_suppliers rather than trusted from the form, because
 * the key can reach every account in this shared project -- including users of
 * the other sites that share it.
 */
export async function resetSupplierPassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse({
    supplierId: formData.get("supplierId") ?? "",
    password: formData.get("password") ?? "",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const supabase = await createClient()
  const [{ data: user }, { data: canManage }, { data: superAdmin }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("margaret_has_permission", { permission_key: "tenders.manage" }),
    supabase.rpc("margaret_is_super_admin"),
  ])

  if (!user?.user) return { success: false, error: "You are not signed in." }
  if (!canManage && !superAdmin) return { success: false, error: "You don't have permission to manage suppliers." }

  // Read through the caller's own client, so RLS still decides what they can
  // see. A supplier they cannot read is a supplier they cannot reset.
  const { data: supplier } = await supabase
    .from("margaret_suppliers")
    .select("id, user_id, company_name")
    .eq("id", parsed.data.supplierId)
    .maybeSingle()

  if (!supplier) return { success: false, error: "That supplier could not be found." }
  if (!supplier.user_id) {
    return { success: false, error: "That supplier has no sign-in account, so there is no password to reset." }
  }

  const admin = createAdminClient()
  if (!admin) {
    return {
      success: false,
      error: "Resetting passwords needs the SUPABASE_SERVICE_ROLE_KEY setting, which isn't configured.",
    }
  }

  const { error } = await admin.auth.admin.updateUserById(supplier.user_id, {
    password: parsed.data.password,
    // A supplier who never opened the confirmation email cannot sign in at
    // all. Procurement setting a password by hand is a deliberate act for a
    // supplier they have already vetted, so confirm the address at the same
    // time rather than leaving them blocked by a second, invisible problem.
    email_confirm: true,
  })
  if (error) return { success: false, error: "We couldn't set that password." }

  revalidatePath("/admin/suppliers")
  return { success: true }
}
