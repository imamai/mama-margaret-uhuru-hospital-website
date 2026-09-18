import type { Metadata } from "next"

import { SupplierForgotPasswordForm } from "@/components/forms/supplier-forgot-password-form"
import { SectionHeading } from "@/components/common/section-heading"

export const metadata: Metadata = {
  title: "Reset your supplier password",
  robots: { index: false, follow: false },
}

export default function SupplierForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Suppliers"
        title="Reset your password"
        description="We'll email you a link to set a new one."
        align="left"
        className="max-w-none"
      />
      <div className="mt-8">
        <SupplierForgotPasswordForm />
      </div>
    </div>
  )
}
