import { AlertTriangle, CheckCircle2, Info, Siren } from "lucide-react"

import { getActiveAnnouncements } from "@/lib/data/announcements"
import { cn } from "@/lib/utils"

const TYPE_STYLES: Record<string, { className: string; Icon: typeof Info }> = {
  info: { className: "bg-brand-primary text-white", Icon: Info },
  warning: { className: "bg-amber-500 text-white", Icon: AlertTriangle },
  emergency: { className: "bg-red-600 text-white", Icon: Siren },
  success: { className: "bg-emerald-600 text-white", Icon: CheckCircle2 },
}

export async function AnnouncementBar() {
  const announcements = await getActiveAnnouncements()
  if (announcements.length === 0) return null

  return (
    <div role="region" aria-label="Announcements">
      {announcements.map((announcement) => {
        const style = TYPE_STYLES[announcement.announcement_type] ?? TYPE_STYLES.info
        const Icon = style.Icon
        return (
          <div key={announcement.id} className={cn("px-4 py-3", style.className)}>
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left">
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <p className="text-sm">
                <span className="font-semibold">{announcement.title}</span>
                {announcement.message ? <span className="ml-1.5 opacity-90">{announcement.message}</span> : null}
              </p>
              {announcement.link_url ? (
                <a
                  href={announcement.link_url}
                  className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:no-underline sm:ml-auto"
                >
                  Learn more
                </a>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
