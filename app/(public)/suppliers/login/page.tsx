import type { Metadata } from "next"
import Link from "next/link"

import { SupplierLoginForm } from "@/components/forms/supplier-login-form"

export const metadata: Metadata = {
  title: "Supplier Login",
  robots: { index: false, follow: false },
}

export default async function SupplierLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <p className="text-center text-lg font-bold text-foreground">Supplier Login</p>
      <p className="mt-1 text-center text-sm text-muted-foreground">Sign in to download tender documents</p>
      {error === "link-expired" ? (
        <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          That link has expired or has already been used. Request a new one below.
        </p>
      ) : null}

      <div className="mt-6">
        <SupplierLoginForm />
      </div>

      <p className="mt-4 text-center text-sm">
        <Link
          href="/suppliers/forgot-password"
          className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Forgot your password?
        </Link>
      </p>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Not registered yet?{" "}
        <Link href="/suppliers/register" className="text-brand-deep hover:underline dark:text-brand-accent">
          Register as a supplier
        </Link>
      </p>
    </div>
  )
}
