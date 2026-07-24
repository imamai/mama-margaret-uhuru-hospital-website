import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/components/forms/contact-form"
import { SectionHeading } from "@/components/common/section-heading"
import { getSiteSettings } from "@/lib/data/settings"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Mama Margaret Uhuru Hospital.",
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionHeading eyebrow="Get in touch" title="Contact Us" align="left" className="max-w-none" />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 size-5 shrink-0 text-brand-deep dark:text-brand-accent" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">Address</p>
              <p className="text-muted-foreground">{settings.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-1 size-5 shrink-0 text-brand-deep dark:text-brand-accent" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">Phone</p>
              <a href={`tel:${settings.emergency_phone}`} className="text-muted-foreground hover:text-foreground">
                {settings.emergency_phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-1 size-5 shrink-0 text-brand-deep dark:text-brand-accent" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">Email</p>
              <p className="text-muted-foreground">info@{settings.hospital_short_name.toLowerCase()}.org</p>
            </div>
          </div>

          {settings.google_maps_embed_url ? (
            <div className="mt-4 aspect-video overflow-hidden rounded-2xl border">
              <iframe
                src={settings.google_maps_embed_url}
                title="Hospital location map"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          ) : null}
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
