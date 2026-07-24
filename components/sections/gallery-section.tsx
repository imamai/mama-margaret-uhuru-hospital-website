import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { getGallery } from "@/lib/data/homepage"

export async function GallerySection() {
  const items = await getGallery(8)
  if (items.length === 0) return null

  return (
    <section aria-labelledby="gallery-heading" className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Around the hospital" title="Gallery" />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl">
            <SmartImage src={item.thumbnail_url ?? item.file_url} alt={item.caption ?? item.title ?? "Gallery image"} />
          </div>
        ))}
      </div>
    </section>
  )
}
