"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { registerSupplier, type SupplierRegisterResult } from "@/lib/actions/suppliers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: SupplierRegisterResult | null = null

export function SupplierRegistrationForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(registerSupplier, initialState)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      if ("needsEmailConfirmation" in state) {
        // Switches the form over to the "check your email" message; the action
        // result only arrives via this effect, so there is no event handler to
        // do it from (a real redirect() happens instead when no confirmation
        // is required, so this branch only runs for the email-confirmation case).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConfirmed(true)
      }
    } else {
      toast.error(state.error)
    }
  }, [state])

  if (confirmed) {
    return (
      <div className="rounded-xl border bg-muted/40 p-6 text-center">
        <p className="font-semibold text-foreground">Check your email</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We&rsquo;ve sent a confirmation link to your email address. Confirm it, then log in -- your supplier
          account will still need to be approved by our procurement team before you can submit bids.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" name="companyName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactPerson">Contact person</Label>
          <Input id="contactPerson" name="contactPerson" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" name="phone" type="tel" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="registrationNumber">Business registration number</Label>
          <Input id="registrationNumber" name="registrationNumber" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kraPin">KRA PIN</Label>
          <Input id="kraPin" name="kraPin" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Business address</Label>
        <Input id="address" name="address" />
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <p className="text-sm font-medium text-foreground">Registration documents</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="kraPinCertificate">KRA PIN Certificate</Label>
            <Input id="kraPinCertificate" name="kraPinCertificate" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="businessRegistrationCertificate">Business Registration Certificate</Label>
            <Input
              id="businessRegistrationCertificate"
              name="businessRegistrationCertificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="taxComplianceCertificate">Tax Compliance Certificate (optional)</Label>
          <Input id="taxComplianceCertificate" name="taxComplianceCertificate" type="file" accept=".pdf,.jpg,.jpeg,.png" />
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Supplier category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue=""
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" minLength={8} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required />
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Registering..." : "Register as a Supplier"}
      </Button>
    </form>
  )
}
