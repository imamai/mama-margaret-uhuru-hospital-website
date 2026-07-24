import type { Metadata } from "next"

import { SectionHeading } from "@/components/common/section-heading"
import { SupplierRegistrationForm } from "@/components/forms/supplier-registration-form"
import { listSupplierCategories } from "@/lib/data/suppliers"

export const metadata: Metadata = {
  title: "Supplier Registration",
  description: "Register as a supplier to bid on hospital tenders.",
}

export default async function SupplierRegisterPage() {
  const categories = await listSupplierCategories()

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <SectionHeading
        eyebrow="Procurement"
        title="Supplier Registration"
        description="Register your company to bid on our published tenders. Your account needs approval from our procurement team before you can submit bids."
        align="left"
        className="max-w-none"
      />
      <div className="mt-10">
        <SupplierRegistrationForm categories={categories} />
      </div>
    </div>
  )
}
