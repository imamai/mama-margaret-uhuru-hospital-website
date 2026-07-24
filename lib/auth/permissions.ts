import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getMyPermissions(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc("margaret_get_my_permissions")
  return (data ?? []).map((row) => row.permission_key)
}

export async function getMyRoles(): Promise<{ role_name: string; role_slug: string }[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc("margaret_get_my_roles")
  return data ?? []
}

export async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.rpc("margaret_is_super_admin")
  return data ?? false
}

export async function hasPermission(permissionKey: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.rpc("margaret_has_permission", {
    permission_key: permissionKey,
  })
  return data ?? false
}
