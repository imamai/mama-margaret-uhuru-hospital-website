"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { setMaintenanceAccount } from "@/lib/actions/admin/staff"
import { Button } from "@/components/ui/button"

/**
 * Takes an account off the staff list, or puts it back.
 *
 * A maintenance account belongs to whoever looks after the site rather than to
 * the hospital, so listing it with the nurses and the procurement officer only
 * invites someone to remove it during a tidy-up. It stays one click from view.
 */
export function MaintenanceToggle({ userId, hidden }: { userId: string; hidden: boolean }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function toggle() {
    startTransition(async () => {
      const result = await setMaintenanceAccount(userId, !hidden)
      if (result.success) {
        toast.success(hidden ? "Account shown on the staff list." : "Account hidden from the staff list.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      disabled={pending}
      aria-label={hidden ? "Show on the staff list" : "Hide from the staff list"}
      title={hidden ? "Show on the staff list" : "Hide from the staff list (maintenance account)"}
    >
      {hidden ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
    </Button>
  )
}
