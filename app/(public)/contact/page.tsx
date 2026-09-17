import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/components/forms/contact-form"
import { SectionHeading } from "@/components/common/section-heading"
import { getSiteSettings } from "@/lib/data/settings"
import { pageMetadata } from "@/lib/seo"
import { toMapEmbedUrl } from "@/lib/maps"

export const metadata: Metadata = pageMetadata({
  title: "Contact Us & Location",
  description:
    "Phone numbers, email, directions and a map for Mama Margaret Uhuru Hospital on Outering Road, off Kamunde Road, Nairobi. Send us a message online.",
  path: "/contact",
})

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const mapEmbedUrl = toMapEmbedUrl(settings.google_maps_embed_url)

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionHeading
        as="h1" eyebrow="Get in touch" title="Contact Us" align="left" className="max-w-none" />

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
              {/* This used to print info@<short name>.org, an address nobody
                  owns and nobody reads. It comes from Settings -> General. */}
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {settings.email}
                </a>
              ) : (
                <p className="text-muted-foreground">Not published yet.</p>
              )}
            </div>
          </div>

          {mapEmbedUrl ? (
            <div className="mt-4 aspect-video overflow-hidden rounded-2xl border">
              <iframe
                src={mapEmbedUrl}
                title={`Map showing ${settings.hospital_name}`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : settings.google_maps_embed_url ? (
            // The saved link cannot be framed and carries no coordinates to
            // rebuild one from. A working link out beats an empty grey box.
            <a
              href={settings.google_maps_embed_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
            >
              <MapPin className="size-4" aria-hidden="true" /> View {settings.hospital_name} on Google Maps
            </a>
          ) : null}
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
