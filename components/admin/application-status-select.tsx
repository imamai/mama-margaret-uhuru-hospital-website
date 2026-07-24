"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { updateApplicationStatus } from "@/lib/actions/admin/job-applications"

const STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview scheduled" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
] as const

export function ApplicationStatusSelect({
  id,
  jobId,
  status,
}: {
  id: string
  jobId: string
  status: string
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as (typeof STATUS_OPTIONS)[number]["value"]
        startTransition(async () => {
          const result = await updateApplicationStatus(id, next, jobId)
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
