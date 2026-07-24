import type { Metadata } from "next"

import { AppointmentForm } from "@/components/forms/appointment-form"
import { SectionHeading } from "@/components/common/section-heading"
import { listDepartments } from "@/lib/data/departments"
import { getSiteSettings } from "@/lib/data/settings"

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Request an appointment with one of our specialists.",
}

export default async function AppointmentsPage() {
  const [departments, settings] = await Promise.all([listDepartments(), getSiteSettings()])

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <SectionHeading
        eyebrow="Patients"
        title="Book an Appointment"
        description={`Fill in the form below and our team will confirm your appointment. For urgent care, call ${settings.emergency_phone} instead.`}
        align="left"
        className="max-w-none"
      />
      <div className="mt-10">
        <AppointmentForm departments={departments} />
      </div>
    </div>
  )
}
