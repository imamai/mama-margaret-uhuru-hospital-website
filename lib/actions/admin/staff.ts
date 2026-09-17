"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

/**
 * Staff accounts and what each of them may do.
 *
 * The permission model was already here; this is the door into it. Every
 * action checks the signed-in user's own permission first, through their own
 * client, so the database is still the authority -- the service-role key is
 * reached for only after that check passes, and only to create an account or
 * set a password.
 *
 * Access to this site is a role, not an account. Revoking someone removes
 * their roles, which takes away everything they could do here at their next
 * request; their login itself is left alone, because this Supabase project is
 * shared with other sites and their account may not be this hospital's to
 * delete.
 */

const PASSWORD_RULE = "Password must be at least 10 characters."

const createSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(255),
  fullName: z.string().trim().min(2, "Enter the person's name.").max(120),
  password: z.string().min(10, PASSWORD_RULE).max(200),
})

const passwordSchema = z.object({
  userId: z.string().uuid(),
  password: z.string().min(10, PASSWORD_RULE).max(200),
})

/** The roles ticked in the dialog arrive as one checkbox each, named "role:<id>". */
function rolesFrom(formData: FormData): string[] {
  const ids: string[] = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("role:") && value) ids.push(key.slice(5))
  }
  return ids
}

type Client = Awaited<ReturnType<typeof createClient>>

type Guard =
  | { ok: false; error: string }
  | { ok: true; supabase: Client; currentUserId: string }

/**
 * May the signed-in user administer staff? Asked of the database through their
 * own session, never assumed from the page they managed to open.
 */
async function guard(): Promise<Guard> {
  const supabase = await createClient()

  const [{ data: user }, { data: canManage }, { data: superAdmin }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("margaret_has_permission", { permission_key: "users.manage" }),
    supabase.rpc("margaret_is_super_admin"),
  ])

  if (!user?.user) return { ok: false, error: "You are not signed in." }
  if (!canManage && !superAdmin) return { ok: false, error: "You don't have permission to manage staff." }

  return { ok: true, supabase, currentUserId: user.user.id }
}

function revalidate() {
  revalidatePath("/admin/staff")
}

/** Replaces someone's roles with exactly the set given. */
async function writeRoles(
  supabase: Client,
  userId: string,
  roleIds: string[]
): Promise<string | null> {
  const { error: clearError } = await supabase.from("margaret_user_roles").delete().eq("user_id", userId)
  if (clearError) return "We couldn't update their roles."

  if (roleIds.length === 0) return null

  const { error } = await supabase
    .from("margaret_user_roles")
    .insert(roleIds.map((roleId) => ({ user_id: userId, role_id: roleId })))

  return error ? "We couldn't update their roles." : null
}

/**
 * Creates a login and gives it its roles.
 *
 * The account is created already confirmed: the administrator hands over the
 * password in person, and the member of staff changes it from Admin -> My
 * Account. No email is sent, which matters because this hospital's staff
 * addresses are not all mailboxes anyone reads.
 */
export async function createStaff(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const check = await guard()
  if (!check.ok) return { success: false, error: check.error }

  const parsed = createSchema.safeParse({
    email: formData.get("email") ?? "",
    fullName: formData.get("fullName") ?? "",
    password: formData.get("password") ?? "",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const roleIds = rolesFrom(formData)
  if (roleIds.length === 0) return { success: false, error: "Choose at least one role." }

  const admin = createAdminClient()
  if (!admin) {
    return {
      success: false,
      error:
        "Creating accounts needs the SUPABASE_SERVICE_ROLE_KEY setting, which isn't configured. You can still grant access to someone who already has an account.",
    }
  }

  const { data: created, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.fullName },
  })

  if (error || !created?.user) {
    const already = error?.message?.toLowerCase().includes("already")
    return {
      success: false,
      error: already
        ? "That email already has an account. Use “Give access to an existing account” instead."
        : "We couldn't create that account. Check the email address and try again.",
    }
  }

  const roleError = await writeRoles(check.supabase, created.user.id, roleIds)
  if (roleError) {
    return {
      success: false,
      error: "The account was created, but their roles were not saved. Set them from the staff list.",
    }
  }

  revalidate()
  return { success: true }
}

/** Gives roles on this site to an account that already exists. */
export async function grantExistingUser(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const check = await guard()
  if (!check.ok) return { success: false, error: check.error }

  const email = z.string().trim().email().safeParse(formData.get("email") ?? "")
  if (!email.success) return { success: false, error: "Enter a valid email address." }

  const roleIds = rolesFrom(formData)
  if (roleIds.length === 0) return { success: false, error: "Choose at least one role." }

  const { data: userId, error } = await check.supabase.rpc("margaret_find_user_by_email", { p_email: email.data })
  if (error) return { success: false, error: "We couldn't look that address up." }
  if (!userId) return { success: false, error: "No account uses that email address. Create one instead." }

  const roleError = await writeRoles(check.supabase, userId as string, roleIds)
  if (roleError) return { success: false, error: roleError }

  revalidate()
  return { success: true }
}

/** Sets exactly which roles someone holds. */
export async function setStaffRoles(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const check = await guard()
  if (!check.ok) return { success: false, error: check.error }

  const userId = z.string().uuid().safeParse(formData.get("userId") ?? "")
  if (!userId.success) return { success: false, error: "Missing the staff member." }

  const roleIds = rolesFrom(formData)

  // Changing your own roles is how an administrator locks themselves out of
  // the site they are standing in. Someone else with the permission can.
  if (userId.data === check.currentUserId) {
    return { success: false, error: "You can't change your own roles. Ask another administrator." }
  }
  if (roleIds.length === 0) {
    return { success: false, error: "Choose at least one role, or use Remove access." }
  }

  const roleError = await writeRoles(check.supabase, userId.data, roleIds)
  if (roleError) return { success: false, error: roleError }

  revalidate()
  return { success: true }
}

/** Sets a new password for someone who has forgotten theirs. */
export async function resetStaffPassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const check = await guard()
  if (!check.ok) return { success: false, error: check.error }

  const parsed = passwordSchema.safeParse({
    userId: formData.get("userId") ?? "",
    password: formData.get("password") ?? "",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const admin = createAdminClient()
  if (!admin) {
    return { success: false, error: "Resetting passwords needs the SUPABASE_SERVICE_ROLE_KEY setting, which isn't configured." }
  }

  // Only for someone this site actually employs -- the service-role key can
  // reach every account in the project, so the target is checked against the
  // staff list rather than taken from the form.
  const { data: staff } = await check.supabase.rpc("margaret_list_staff")
  const isStaff = (staff ?? []).some((row: { user_id: string }) => row.user_id === parsed.data.userId)
  if (!isStaff) return { success: false, error: "That person is not on this hospital's staff list." }

  const { error } = await admin.auth.admin.updateUserById(parsed.data.userId, { password: parsed.data.password })
  if (error) return { success: false, error: "We couldn't set that password." }

  revalidate()
  return { success: true }
}

/**
 * Marks an account as maintenance, or stops it being one.
 *
 * Only a super admin, because this decides what other administrators see. The
 * database enforces that too; this check is so the refusal reads properly
 * instead of arriving as an RLS failure.
 */
export async function setMaintenanceAccount(userId: string, hidden: boolean): Promise<ActionResult> {
  const check = await guard()
  if (!check.ok) return { success: false, error: check.error }

  const { data: superAdmin } = await check.supabase.rpc("margaret_is_super_admin")
  if (!superAdmin) {
    return { success: false, error: "Only a super admin can hide or show a maintenance account." }
  }

  if (hidden) {
    const { error } = await check.supabase
      .from("margaret_maintenance_accounts")
      .upsert({ user_id: userId, created_by: check.currentUserId }, { onConflict: "user_id" })
    if (error) return { success: false, error: "We couldn't hide that account." }
  } else {
    const { error } = await check.supabase.from("margaret_maintenance_accounts").delete().eq("user_id", userId)
    if (error) return { success: false, error: "We couldn't show that account." }
  }

  revalidate()
  return { success: true }
}

/**
 * Takes away every role this site has given someone.
 *
 * Their login survives: it may belong to another site in this project, and in
 * any case an account is not ours to delete. Without a role they can sign in
 * and see nothing.
 */
export async function revokeStaffAccess(userId: string): Promise<ActionResult> {
  const check = await guard()
  if (!check.ok) return { success: false, error: check.error }

  if (userId === check.currentUserId) {
    return { success: false, error: "You can't remove your own access. Ask another administrator." }
  }

  const { error } = await check.supabase.from("margaret_user_roles").delete().eq("user_id", userId)
  if (error) return { success: false, error: "You don't have permission to do this." }

  revalidate()
  return { success: true }
}
