import type { Metadata } from "next"

import { SupplierResetPasswordForm } from "@/components/forms/supplier-reset-password-form"
import { SectionHeading } from "@/components/common/section-heading"

export const metadata: Metadata = {
  title: "Set a new supplier password",
  robots: { index: false, follow: false },
}

export default function SupplierResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Suppliers"
        title="Choose a new password"
        align="left"
        className="max-w-none"
      />
      <div className="mt-8">
        <SupplierResetPasswordForm />
      </div>
    </div>
  )
}
