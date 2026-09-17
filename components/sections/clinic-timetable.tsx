import { Clock } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { listClinicSchedule } from "@/lib/data/clinics"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function hhmm(value: string | null): string {
  return value ? value.slice(0, 5) : ""
}

/**
 * The weekly consultant timetable.
 *
 * Grouped by day because that is the question a patient brings to it — "which
 * day do I travel?" — and a day with no clinics is simply not shown. Edited
 * from Admin → Clinic Timetable; the section disappears when it is empty.
 */
export async function ClinicTimetable() {
  const rows = await listClinicSchedule()
  if (rows.length === 0) return null

  const byDay = new Map<number, typeof rows>()
  for (const row of rows) {
    const list = byDay.get(row.day_of_week) ?? []
    list.push(row)
    byDay.set(row.day_of_week, list)
  }

  return (
    <section aria-label="Consultant clinic timetable" className="mt-16">
      <SectionHeading
        eyebrow="When to come"
        title="Consultant Clinic Timetable"
        align="left"
        className="max-w-none"
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Specialist clinics run on the days and times below.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...byDay.entries()].map(([day, sittings]) => (
          <div key={day} className="rounded-xl border p-5">
            <h3 className="font-semibold text-foreground">
              {DAYS[day - 1]}
            </h3>
            <ul className="mt-3 divide-y">
              {sittings.map((s) => (
                <li key={s.id} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="flex shrink-0 items-center gap-1 pt-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {s.end_time ? `${hhmm(s.start_time)}–${hhmm(s.end_time)}` : hhmm(s.start_time)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{s.clinic_label}</span>
                    {s.specialist_name ? (
                      <span className="block text-xs text-muted-foreground">
                        {s.specialist_name}
                        {s.specialist_role ? ` · ${s.specialist_role}` : ""}
                        {s.room ? ` · ${s.room}` : ""}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
