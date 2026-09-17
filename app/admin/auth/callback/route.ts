import { NextResponse, type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

/**
 * Where a recovery email lands.
 *
 * Supabase sends one of two shapes depending on how the project's email
 * template is written -- a PKCE `code`, or a `token_hash` with a `type` -- so
 * both are handled here rather than leaving a hospital administrator staring
 * at a link that does nothing.
 *
 * Either way the exchange sets a session cookie, and that session is what
 * authorises the new password on the next page. The link works once.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type")

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}/admin/reset-password`)
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "recovery" | "invite" | "email",
      token_hash: tokenHash,
    })
    if (!error) return NextResponse.redirect(`${origin}/admin/reset-password`)
  }

  return NextResponse.redirect(`${origin}/admin/login?error=link-expired`)
}
