import type { Metadata } from "next"
import Link from "next/link"

import { SupplierLoginForm } from "@/components/forms/supplier-login-form"

export const metadata: Metadata = { title: "Supplier Login" }

export default function SupplierLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <p className="text-center text-lg font-bold text-foreground">Supplier Login</p>
      <p className="mt-1 text-center text-sm text-muted-foreground">Sign in to view tenders and submit bids</p>
      <div className="mt-6">
        <SupplierLoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Not registered yet?{" "}
        <Link href="/suppliers/register" className="text-brand-deep hover:underline dark:text-brand-accent">
          Register as a supplier
        </Link>
      </p>
    </div>
  )
}
