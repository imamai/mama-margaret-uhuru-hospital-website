import type { Metadata } from "next"

import { SectionHeading } from "@/components/common/section-heading"
import { SupplierRegistrationForm } from "@/components/forms/supplier-registration-form"
import { listSupplierCategories } from "@/lib/data/suppliers"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Supplier Registration",
  description:
    "Register as a supplier at Mama Margaret Uhuru Hospital, Nairobi to access published tender documents. Submit your company details and category of supply.",
  path: "/suppliers/register",
})

export default async function SupplierRegisterPage() {
  const categories = await listSupplierCategories()

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Procurement"
        title="Supplier Registration"
        description="Register your company to take part in our published tenders. Your account needs approval from our procurement team before you can download tender documents."
        align="left"
        className="max-w-none"
      />
      <div className="mt-10">
        <SupplierRegistrationForm categories={categories} />
      </div>
    </div>
  )
}
