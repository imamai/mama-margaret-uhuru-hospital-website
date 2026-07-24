import { PhoneCall, Siren } from "lucide-react"

import { getSiteSettings } from "@/lib/data/settings"

export async function EmergencyBanner() {
  const settings = await getSiteSettings()

  return (
    <section aria-labelledby="emergency-heading" className="bg-brand-deep text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <Siren className="size-8 shrink-0" aria-hidden="true" />
          <div>
            <h2 id="emergency-heading" className="text-lg font-bold">
              24/7 Emergency Care
            </h2>
            <p className="text-sm text-white/80">
              Our emergency department is open around the clock, every day of the year.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${settings.emergency_phone}`}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-deep transition-opacity hover:opacity-90"
          >
            <PhoneCall className="size-4" aria-hidden="true" />
            Emergency: {settings.emergency_phone}
          </a>
          {settings.ambulance_phone ? (
            <a
              href={`tel:${settings.ambulance_phone}`}
              className="flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <PhoneCall className="size-4" aria-hidden="true" />
              Ambulance: {settings.ambulance_phone}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
