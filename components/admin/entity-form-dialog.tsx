"use client"

import { useActionState, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { ActionResult } from "@/lib/actions/forms"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type EntityFieldConfig = {
  name: string
  label: string
  type?: "text" | "textarea" | "number" | "date" | "datetime-local" | "select" | "checkbox" | "file" | "image"
  required?: boolean
  options?: { value: string; label: string }[]
  defaultValue?: string
  /** For type "file": accept attribute (e.g. "image/*") and helper text. */
  accept?: string
  hint?: string
}

/**
 * Config-driven create/edit dialog reused by every admin module: pass the
 * field list and a server action, get a fully working form. This is the
 * pattern the remaining CMS modules (news, events, tenders, ...) should
 * follow rather than hand-rolling a new dialog per table.
 */
export function EntityFormDialog({
  trigger,
  title,
  description,
  fields,
  action,
  hiddenFields,
}: {
  trigger: ReactNode
  title: string
  description?: string
  fields: EntityFieldConfig[]
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
  hiddenFields?: Record<string, string>
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null)
  const router = useRouter()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success(`${title} saved.`)
      // Closes the dialog after a successful save; the action result only
      // arrives via this effect, so there is no event handler to do it from.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false)
      router.refresh()
    } else {
      toast.error(state.error)
    }
  }, [state, title, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <form action={formAction} encType="multipart/form-data" className="space-y-4">
          {Object.entries(hiddenFields ?? {}).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}

          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required ? <span className="text-destructive"> *</span> : null}
              </Label>
              {field.type === "textarea" ? (
                <Textarea id={field.name} name={field.name} required={field.required} defaultValue={field.defaultValue} rows={4} />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  defaultValue={field.defaultValue}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  defaultChecked={field.defaultValue === "true"}
                  className="size-4 rounded border-input"
                />
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
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  defaultValue={field.defaultValue}
                />
              )}
              {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
            </div>
          ))}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
