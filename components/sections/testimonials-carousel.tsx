import { Quote, Star } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Card, CardContent } from "@/components/ui/card"
import { getTestimonials } from "@/lib/data/homepage"

export async function TestimonialsCarousel() {
  const testimonials = await getTestimonials()
  if (testimonials.length === 0) return null

  return (
    <section aria-labelledby="testimonials-heading" className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Patient stories" title="What Our Patients Say" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardContent className="space-y-4 py-2">
              <Quote className="size-6 text-brand-primary/40" aria-hidden="true" />
              <p className="text-sm text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                  <SmartImage src={testimonial.photo_url} alt={testimonial.patient_name} kind="people" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.patient_name}</p>
                  {testimonial.rating ? (
                    <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${i < testimonial.rating! ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
