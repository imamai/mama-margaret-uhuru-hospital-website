"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

import { moveSectionDown, moveSectionUp, toggleSectionVisibility } from "@/lib/actions/admin/homepage"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { TableCell, TableRow } from "@/components/ui/table"

export function HomepageSectionRow({
  id,
  title,
  sectionKey,
  isVisible,
  isFirst,
  isLast,
}: {
  id: string
  title: string
  sectionKey: string
  isVisible: boolean
  isFirst: boolean
  isLast: boolean
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const run = (fn: () => Promise<{ success: boolean; error?: string }>) => {
    startTransition(async () => {
      const result = await fn()
      if (!result.success) toast.error(result.error)
      router.refresh()
    })
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{title}</TableCell>
      <TableCell className="text-muted-foreground">{sectionKey}</TableCell>
      <TableCell>
        <Switch
          checked={isVisible}
          disabled={pending}
          onCheckedChange={(checked) => run(() => toggleSectionVisibility(id, checked))}
          aria-label={`Toggle ${title} visibility`}
        />
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon-sm" disabled={pending || isFirst} onClick={() => run(() => moveSectionUp(id))} aria-label="Move up">
          <ChevronUp className="size-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" disabled={pending || isLast} onClick={() => run(() => moveSectionDown(id))} aria-label="Move down">
          <ChevronDown className="size-4" aria-hidden="true" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
