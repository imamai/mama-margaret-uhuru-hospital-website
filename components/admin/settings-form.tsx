"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import type { ActionResult } from "@/lib/actions/forms"
import type { EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

/**
 * Inline (non-dialog) sibling of EntityFormDialog for settings screens, which
 * live on their own page rather than behind a "New"/"Edit" trigger.
 */
export function SettingsForm({
  fields,
  action,
  submitLabel = "Save changes",
}: {
  fields: EntityFieldConfig[]
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
  submitLabel?: string
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Settings saved.")
    } else {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form action={formAction} encType="multipart/form-data" className="max-w-xl space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea id={field.name} name={field.name} defaultValue={field.defaultValue} rows={3} />
          ) : field.type === "file" ? (
            <Input id={field.name} name={field.name} type="file" accept={field.accept} required={field.required} />
          ) : field.type === "image" ? (
            <div className="space-y-2">
              <Input id={field.name} name={field.name} type="file" accept={field.accept ?? "image/*"} />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or paste a URL
                <span className="h-px flex-1 bg-border" />
              </div>
              <Input
                id={`${field.name}Url`}
                name={`${field.name}Url`}
                type="url"
                inputMode="url"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          ) : (
            <Input id={field.name} name={field.name} type={field.type ?? "text"} defaultValue={field.defaultValue} />
          )}
        </div>
      ))}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
