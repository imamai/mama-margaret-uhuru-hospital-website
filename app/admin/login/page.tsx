import type { Metadata } from "next"

import { LoginForm } from "@/components/admin/login-form"
import { getSiteSettings } from "@/lib/data/settings"

export const metadata: Metadata = { title: "Admin Sign In" }

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const settings = await getSiteSettings()

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-background p-8 shadow-sm">
        <p className="text-center text-lg font-bold text-foreground">{settings.hospital_short_name} Admin</p>
        <p className="mt-1 text-center text-sm text-muted-foreground">Sign in to manage the website</p>
        <div className="mt-6">
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  )
}
