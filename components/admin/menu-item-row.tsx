"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Pencil } from "lucide-react"
import { toast } from "sonner"

import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog } from "@/components/admin/entity-form-dialog"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { deleteMenuItem, moveMenuItemDown, moveMenuItemUp, updateMenuItem } from "@/lib/actions/admin/menus"

export function MenuItemRow({
  id,
  menuId,
  label,
  url,
  status,
  isFirst,
  isLast,
}: {
  id: string
  menuId: string
  label: string
  url: string
  status: string
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
      <TableCell className="font-medium text-foreground">{label}</TableCell>
      <TableCell className="text-muted-foreground">{url}</TableCell>
      <TableCell className="text-muted-foreground">{status}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon-sm" disabled={pending || isFirst} onClick={() => run(() => moveMenuItemUp(id, menuId))} aria-label="Move up">
          <ChevronUp className="size-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" disabled={pending || isLast} onClick={() => run(() => moveMenuItemDown(id, menuId))} aria-label="Move down">
          <ChevronDown className="size-4" aria-hidden="true" />
        </Button>
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit ${label}`}
          fields={[
            { name: "label", label: "Label", required: true, defaultValue: label },
            { name: "url", label: "URL", required: true, defaultValue: url },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: [
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ],
              defaultValue: status,
            },
          ]}
          action={updateMenuItem}
          hiddenFields={{ id, menu_id: menuId }}
        />
        <DeleteButton id={id} action={deleteMenuItem} confirmMessage={`Delete "${label}" from this menu?`} />
      </TableCell>
    </TableRow>
  )
}
