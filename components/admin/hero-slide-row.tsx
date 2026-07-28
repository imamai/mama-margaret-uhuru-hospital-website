"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronDown, ChevronUp, Pencil } from "lucide-react"
import { toast } from "sonner"

import { deleteHeroSlide, moveHeroSlideDown, moveHeroSlideUp, updateHeroSlide } from "@/lib/actions/admin/hero-slides"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export type HeroSlideListItem = {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  cta_label: string | null
  cta_url: string | null
  status: string
}

function fieldsFor(slide: HeroSlideListItem): EntityFieldConfig[] {
  return [
    { name: "title", label: "Title", required: true, defaultValue: slide.title },
    { name: "subtitle", label: "Subtitle", type: "textarea", defaultValue: slide.subtitle ?? "" },
    {
      name: "image",
      label: "Replace image",
      type: "file",
      accept: "image/*",
      hint: "Leave blank to keep the current image. Recommended: at least 1600×900px, under 10MB.",
    },
    { name: "ctaLabel", label: "Button label", defaultValue: slide.cta_label ?? "" },
    { name: "ctaUrl", label: "Button link", defaultValue: slide.cta_url ?? "" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: slide.status },
  ]
}

export function HeroSlideRow({ slide, isFirst, isLast }: { slide: HeroSlideListItem; isFirst: boolean; isLast: boolean }) {
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
      <TableCell>
        {slide.image_url ? (
          <Image src={slide.image_url} alt="" width={96} height={54} className="rounded-md border object-cover" unoptimized />
        ) : (
          <div className="flex h-[54px] w-24 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">No image</div>
        )}
      </TableCell>
      <TableCell className="font-medium text-foreground">{slide.title}</TableCell>
      <TableCell>
        <Badge variant={slide.status === "published" ? "default" : "outline"}>{slide.status}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon-sm" disabled={pending || isFirst} onClick={() => run(() => moveHeroSlideUp(slide.id))} aria-label="Move up">
          <ChevronUp className="size-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" disabled={pending || isLast} onClick={() => run(() => moveHeroSlideDown(slide.id))} aria-label="Move down">
          <ChevronDown className="size-4" aria-hidden="true" />
        </Button>
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Edit ${slide.title}`}
          fields={fieldsFor(slide)}
          action={updateHeroSlide}
          hiddenFields={{ id: slide.id }}
        />
        <DeleteButton id={slide.id} action={deleteHeroSlide} confirmMessage={`Delete "${slide.title}"?`} />
      </TableCell>
    </TableRow>
  )
}
