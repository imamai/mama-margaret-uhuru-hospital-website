import "server-only"

import { createClient as createServiceClient } from "@supabase/supabase-js"

/**
 * A Supabase client holding the service-role key.
 *
 * This bypasses RLS entirely and can reach the auth admin API, which is the
 * only way to create an account with a password already set. Nothing else in
 * this codebase should use it: every other write goes through the signed-in
 * user's own client, so the database decides what they may do.
 *
 * Two rules, because this key is more dangerous here than in a single-site
 * project -- this Supabase project is shared with several unrelated sites, so
 * the key can reach their users too:
 *
 *   1. Every caller checks the signed-in user's permission FIRST, through
 *      their own client, and only then reaches for this one.
 *   2. It is used to create accounts and set passwords, never to delete them.
 *      Removing someone from this site removes their roles here; their login
 *      is not this site's to destroy.
 *
 * Returns null when the key is not configured, so the admin can say so plainly
 * instead of failing with a stack trace. Everything that does not need the key
 * -- granting roles, revoking access, changing your own password -- keeps
 * working without it.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  return createServiceClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** Whether staff accounts can be created from the admin at all. */
export function canCreateAccounts(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * The account id for an email address, or null.
 *
 * Uses GoTrue's admin filter rather than listUsers, which returns
 * "Database error finding users" (HTTP 500) on this project -- see
 * docs/admin-recovery.md. The filter is a partial match, so the result is
 * compared exactly before it is trusted.
 */
export async function findUserIdByEmail(email: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  const wanted = email.trim().toLowerCase()

  try {
    const response = await fetch(`${url}/auth/v1/admin/users?filter=${encodeURIComponent(wanted)}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    })
    if (!response.ok) return null

    const body = (await response.json()) as { users?: { id: string; email?: string | null }[] }
    const exact = (body.users ?? []).find((u) => (u.email ?? "").toLowerCase() === wanted)
    return exact?.id ?? null
  } catch {
    return null
  }
}
