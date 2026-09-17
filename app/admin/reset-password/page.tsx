import type { Metadata } from "next"

import { ResetPasswordForm } from "@/components/admin/reset-password-form"
import { getSiteSettings } from "@/lib/data/settings"

export const metadata: Metadata = { title: "Set a new password" }

export default async function ResetPasswordPage() {
  const settings = await getSiteSettings()

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-background p-8 shadow-sm">
        <p className="text-center text-lg font-bold text-foreground">{settings.hospital_short_name} Admin</p>
        <p className="mt-1 text-center text-sm text-muted-foreground">Choose a new password</p>
        <div className="mt-6">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
