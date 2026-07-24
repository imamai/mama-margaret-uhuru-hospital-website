import { PhoneCall } from "lucide-react"

export function EmergencyBar({
  emergencyPhone,
  ambulancePhone,
}: {
  emergencyPhone: string
  ambulancePhone: string
}) {
  return (
    <div className="bg-brand-deep text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-1.5 text-xs sm:text-sm">
        <a href={`tel:${emergencyPhone}`} className="flex items-center gap-1.5 font-medium hover:underline">
          <PhoneCall className="size-3.5" aria-hidden="true" />
          Emergency: {emergencyPhone}
        </a>
        {ambulancePhone ? (
          <a href={`tel:${ambulancePhone}`} className="flex items-center gap-1.5 hover:underline">
            <PhoneCall className="size-3.5" aria-hidden="true" />
            Ambulance: {ambulancePhone}
          </a>
        ) : null}
      </div>
    </div>
  )
}
