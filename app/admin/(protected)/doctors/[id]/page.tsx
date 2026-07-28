import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { DeleteButton } from "@/components/admin/delete-button"
import { DoctorAvailabilityForm } from "@/components/admin/doctor-availability-form"
import { DoctorPublicationForm } from "@/components/admin/doctor-publication-form"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteDoctorAvailability, deleteDoctorPublication } from "@/lib/actions/admin/doctor-relations"
import { createClient } from "@/lib/supabase/server"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default async function AdminDoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: doctor } = await supabase
    .from("margaret_doctors")
    .select("id, full_name, specialization, status, department_id")
    .eq("id", id)
    .maybeSingle()

  if (!doctor) notFound()

  const [{ data: department }, { data: availability }, { data: publications }] = await Promise.all([
    doctor.department_id
      ? supabase.from("margaret_departments").select("name").eq("id", doctor.department_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("margaret_doctor_availability")
      .select("id, day_of_week, start_time, end_time, location")
      .eq("doctor_id", id)
      .order("day_of_week", { ascending: true }),
    supabase
      .from("margaret_doctor_publications")
      .select("id, title, publication_url, published_year")
      .eq("doctor_id", id)
      .order("published_year", { ascending: false }),
  ])

  return (
    <div>
      <Link href="/admin/doctors" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to Doctors
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-deep uppercase dark:text-brand-accent">
            {department?.name ?? doctor.specialization}
          </p>
          <h1 className="text-2xl font-bold">{doctor.full_name}</h1>
        </div>
        <Badge variant={doctor.status === "published" ? "default" : "outline"}>{doctor.status}</Badge>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">Availability</h2>
        <DoctorAvailabilityForm doctorId={doctor.id} />
        <div className="mt-4 overflow-x-auto rounded-xl border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(availability ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    No availability slots added yet.
                  </TableCell>
                </TableRow>
              ) : (
                (availability ?? []).map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{DAYS[slot.day_of_week]}</TableCell>
                    <TableCell>{slot.start_time.slice(0, 5)}</TableCell>
                    <TableCell>{slot.end_time.slice(0, 5)}</TableCell>
                    <TableCell className="text-muted-foreground">{slot.location ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <DeleteButton
                        id={slot.id}
                        action={(slotId) => deleteDoctorAvailability(slotId, doctor.id)}
                        confirmMessage="Delete this availability slot?"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Publications</h2>
        <DoctorPublicationForm doctorId={doctor.id} />
        <div className="mt-4 overflow-x-auto rounded-xl border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(publications ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                    No publications added yet.
                  </TableCell>
                </TableRow>
              ) : (
                (publications ?? []).map((pub) => (
                  <TableRow key={pub.id}>
                    <TableCell>
                      {pub.publication_url ? (
                        <a href={pub.publication_url} target="_blank" rel="noopener noreferrer" className="text-brand-deep hover:underline dark:text-brand-accent">
                          {pub.title}
                        </a>
                      ) : (
                        pub.title
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{pub.published_year ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <DeleteButton
                        id={pub.id}
                        action={(pubId) => deleteDoctorPublication(pubId, doctor.id)}
                        confirmMessage={`Delete "${pub.title}"?`}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
