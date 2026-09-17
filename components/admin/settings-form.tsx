"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import type { ActionResult } from "@/lib/actions/forms"
import type { EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Button } from "@/components/ui/button"
import { ColorField } from "@/components/admin/color-field"
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
  defaults,
  restoreLabel = "Restore defaults",
}: {
  fields: EntityFieldConfig[]
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
  submitLabel?: string
  /** Field name -> the shipped value, which enables the restore button. */
  defaults?: Record<string, string>
  restoreLabel?: string
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null)

  // Bumped by the restore button. The fields are keyed on it so they remount
  // carrying the shipped values -- the colour boxes hold their own state, and
  // nothing short of a remount puts it back. Nothing is written until Save is
  // pressed, so a mis-click costs one press of the browser's back button.
  const [restoredAt, setRestoredAt] = useState(0)

  const shown = restoredAt
    ? fields.map((field) =>
        defaults?.[field.name] ? { ...field, defaultValue: defaults[field.name] } : field
      )
    : fields

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
      <div key={restoredAt} className="space-y-4">
      {shown.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "color" ? (
            <ColorField id={field.name} name={field.name} defaultValue={field.defaultValue} />
          ) : field.type === "textarea" ? (
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
          {/* Some fields carry a hint and, until now, this form quietly dropped
              it -- the branding colours need theirs to say where each one lands. */}
          {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
        </div>
      ))}
      </div>

      {defaults ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed p-3">
          <Button type="button" variant="outline" size="sm" onClick={() => setRestoredAt((n) => n + 1)}>
            {restoreLabel}
          </Button>
          <p className="text-xs text-muted-foreground">
            Puts the original values back in the boxes. Nothing changes on the site until you save.
          </p>
        </div>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
