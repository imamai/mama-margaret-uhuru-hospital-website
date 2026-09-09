import { CalendarDays, MapPin } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Card, CardContent } from "@/components/ui/card"
import { listUpcomingEvents } from "@/lib/data/events"

export async function EventsGrid() {
  const events = await listUpcomingEvents(3)
  if (events.length === 0) return null

  return (
    <section aria-labelledby="events-heading" className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="What's on" title="Upcoming Events" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden py-0">
              <div className="relative h-36">
                <SmartImage src={event.featured_image_url} alt={event.title} kind="event" />
              </div>
              <CardContent className="space-y-2 py-4">
                <p className="text-xs font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">
                  {event.event_type}
                </p>
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {new Date(event.starts_at).toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {event.location ? (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4" aria-hidden="true" />
                    {event.location}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
