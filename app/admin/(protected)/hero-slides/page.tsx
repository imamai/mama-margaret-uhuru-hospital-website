import { Plus } from "lucide-react"

import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { FOCAL_POINT_OPTIONS, HeroSlideRow } from "@/components/admin/hero-slide-row"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createHeroSlide } from "@/lib/actions/admin/hero-slides"
import { createClient } from "@/lib/supabase/server"

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

const NEW_SLIDE_FIELDS: EntityFieldConfig[] = [
  { name: "title", label: "Title", required: true },
  { name: "subtitle", label: "Subtitle", type: "textarea" },
  {
    name: "image",
    label: "Image",
    type: "image",
    hint: "Upload a file or paste an image URL. Recommended: at least 1600×900px, under 10MB.",
  },
  {
    name: "focalPoint",
    label: "Image position",
    type: "select",
    options: FOCAL_POINT_OPTIONS,
    defaultValue: "center",
    hint: "Which part of the photo stays visible when it's cropped to fit the banner.",
  },
  { name: "ctaLabel", label: "Button label" },
  { name: "ctaUrl", label: "Button link", defaultValue: "/appointments" },
  { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: "draft" },
]

export default async function AdminHeroSlidesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_hero_slides")
    .select("id, title, subtitle, image_url, cta_label, cta_url, focal_point, status")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })

  const slides = data ?? []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hero Slides</h1>
          <p className="text-muted-foreground">Manage the rotating banner photos shown at the top of the homepage.</p>
        </div>
        <EntityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" aria-hidden="true" /> New Slide
            </Button>
          }
          title="New Hero Slide"
          fields={NEW_SLIDE_FIELDS}
          action={createHeroSlide}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No hero slides yet. Add one to replace the default gradient banner.
                </TableCell>
              </TableRow>
            ) : (
              slides.map((slide, i) => (
                <HeroSlideRow key={slide.id} slide={slide} isFirst={i === 0} isLast={i === slides.length - 1} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
