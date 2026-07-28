"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { updateSupplierStatus } from "@/lib/actions/admin/suppliers"

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
] as const

export function SupplierStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as (typeof STATUS_OPTIONS)[number]["value"]
        startTransition(async () => {
          const result = await updateSupplierStatus(id, next)
          if (!result.success) toast.error(result.error)
          else toast.success("Status updated.")
          router.refresh()
        })
      }}
      className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
