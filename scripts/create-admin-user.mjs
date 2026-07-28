// Bootstraps a super-admin user: creates the auth user, profile, and role assignment.
// Requires the Supabase service role key (never the anon key) since it bypasses RLS.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-admin-user.mjs

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const ADMIN_EMAIL = "admin@mamamargaretuhuruhospital.co.ke"
const ADMIN_PASSWORD = "admin123"
const ADMIN_FULL_NAME = "Site Administrator"

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Set SUPABASE_SERVICE_ROLE_KEY (from Supabase dashboard > Project Settings > API) and re-run."
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function findUserByEmail(email) {
  // admin.listUsers has no email filter param in this SDK version; page through results.
  let page = 1
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw new Error(`Failed to list users: ${error.message}`)
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (match) return match
    if (data.users.length < 200) return null
    page += 1
  }
}

async function main() {
  let userId = (await findUserByEmail(ADMIN_EMAIL))?.id

  if (!userId) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_FULL_NAME },
    })

    if (createError) {
      throw new Error(`Failed to create auth user: ${createError.message}`)
    }

    userId = created.user.id
  }

  // A DB trigger auto-creates the profile row on auth.users insert; upsert to set the name either way.
  const { error: profileError } = await supabase
    .from("margaret_profiles")
    .upsert({ id: userId, full_name: ADMIN_FULL_NAME })

  if (profileError) {
    throw new Error(`Failed to upsert profile: ${profileError.message}`)
  }

  const { data: role, error: roleError } = await supabase
    .from("margaret_roles")
    .select("id")
    .eq("slug", "super-admin")
    .single()

  if (roleError || !role) {
    throw new Error(`Could not find super-admin role: ${roleError?.message ?? "not found"}`)
  }

  const { error: assignError } = await supabase
    .from("margaret_user_roles")
    .upsert({ user_id: userId, role_id: role.id }, { onConflict: "user_id,role_id" })

  if (assignError) {
    throw new Error(`Failed to assign super-admin role: ${assignError.message}`)
  }

  console.log(`Admin user created: ${ADMIN_EMAIL}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
