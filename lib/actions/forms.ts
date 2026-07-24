"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

export type ActionResult = { success: true } | { success: false; error: string }

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(200),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Please enter a subject.").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000),
  honeypot: z.string().max(0).optional().or(z.literal("")),
})

export async function submitContactForm(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    subject: formData.get("subject"),
    message: formData.get("message"),
    honeypot: formData.get("website") ?? "",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." }
  }

  if (parsed.data.honeypot) {
    // Silently accept bot submissions without writing them.
    return { success: true }
  }

  const supabase = await createClient()

  const { data: formType } = await supabase
    .from("margaret_form_types")
    .select("id")
    .eq("slug", "contact")
    .eq("status", "active")
    .maybeSingle()

  if (!formType) {
    return { success: false, error: "Contact form is temporarily unavailable. Please call us instead." }
  }

  const { error } = await supabase.from("margaret_form_submissions").insert({
    form_type_id: formType.id,
    submitted_by_name: parsed.data.name,
    submitted_by_email: parsed.data.email,
    submitted_by_phone: parsed.data.phone || null,
    data: { subject: parsed.data.subject, message: parsed.data.message },
    status: "new",
  })

  if (error) {
    return { success: false, error: "Something went wrong submitting your message. Please try again." }
  }

  return { success: true }
}

const feedbackSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(200),
  email: z.string().trim().email("Please enter a valid email address.").optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  message: z.string().trim().min(5, "Please enter your feedback.").max(5000),
  honeypot: z.string().max(0).optional().or(z.literal("")),
})

export async function submitFeedback(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = feedbackSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    rating: formData.get("rating") || undefined,
    message: formData.get("message"),
    honeypot: formData.get("website") ?? "",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." }
  }

  if (parsed.data.honeypot) {
    return { success: true }
  }

  const supabase = await createClient()

  const { data: formType } = await supabase
    .from("margaret_form_types")
    .select("id")
    .eq("slug", "feedback")
    .eq("status", "active")
    .maybeSingle()

  if (!formType) {
    return { success: false, error: "Feedback form is temporarily unavailable. Please try again later." }
  }

  const { error } = await supabase.from("margaret_form_submissions").insert({
    form_type_id: formType.id,
    submitted_by_name: parsed.data.name,
    submitted_by_email: parsed.data.email || null,
    data: { rating: parsed.data.rating ?? null, message: parsed.data.message },
    status: "new",
  })

  if (error) {
    return { success: false, error: "Something went wrong submitting your feedback. Please try again." }
  }

  return { success: true }
}

const appointmentSchema = z.object({
  patientName: z.string().trim().min(2, "Please enter your full name.").max(200),
  patientPhone: z.string().trim().min(7, "Please enter a valid phone number.").max(30),
  patientEmail: z.string().trim().email("Please enter a valid email address.").optional().or(z.literal("")),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  preferredDate: z.string().min(1, "Please choose a preferred date."),
  preferredTime: z.string().optional().or(z.literal("")),
  reason: z.string().trim().max(2000).optional().or(z.literal("")),
  isInsured: z.enum(["true", "false"]),
  insuranceProvider: z.string().trim().max(200).optional().or(z.literal("")),
  honeypot: z.string().max(0).optional().or(z.literal("")),
})

export async function submitAppointment(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = appointmentSchema.safeParse({
    patientName: formData.get("patientName"),
    patientPhone: formData.get("patientPhone"),
    patientEmail: formData.get("patientEmail") ?? "",
    departmentId: formData.get("departmentId") ?? "",
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime") ?? "",
    reason: formData.get("reason") ?? "",
    isInsured: formData.get("isInsured") ?? "false",
    insuranceProvider: formData.get("insuranceProvider") ?? "",
    honeypot: formData.get("website") ?? "",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." }
  }

  if (parsed.data.honeypot) {
    return { success: true }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_appointments").insert({
    patient_name: parsed.data.patientName,
    patient_phone: parsed.data.patientPhone,
    patient_email: parsed.data.patientEmail || null,
    department_id: parsed.data.departmentId || null,
    preferred_date: parsed.data.preferredDate,
    preferred_time: parsed.data.preferredTime || null,
    reason: parsed.data.reason || null,
    is_insured: parsed.data.isInsured === "true",
    insurance_provider: parsed.data.insuranceProvider || null,
    status: "pending",
  })

  if (error) {
    return { success: false, error: "Something went wrong booking your appointment. Please call us instead." }
  }

  return { success: true }
}

const jobApplicationSchema = z.object({
  jobId: z.string().uuid(),
  fullName: z.string().trim().min(2, "Please enter your full name.").max(200),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(7, "Please enter a valid phone number.").max(30),
  coverLetter: z.string().trim().max(5000).optional().or(z.literal("")),
  honeypot: z.string().max(0).optional().or(z.literal("")),
})

const DOCUMENT_FIELDS = [
  { field: "cv", type: "cv", required: true },
  { field: "coverLetterFile", type: "cover_letter", required: false },
  { field: "certificates", type: "certificate", required: false },
  { field: "idDocument", type: "id_document", required: true },
  { field: "professionalLicense", type: "professional_license", required: false },
  { field: "passportPhoto", type: "passport_photo", required: true },
] as const

const MAX_FILE_BYTES = 10 * 1024 * 1024

export async function submitJobApplication(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = jobApplicationSchema.safeParse({
    jobId: formData.get("jobId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    coverLetter: formData.get("coverLetter") ?? "",
    honeypot: formData.get("website") ?? "",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." }
  }

  if (parsed.data.honeypot) {
    return { success: true }
  }

  for (const doc of DOCUMENT_FIELDS) {
    const file = formData.get(doc.field)
    if (doc.required && (!(file instanceof File) || file.size === 0)) {
      return { success: false, error: `Please attach your ${doc.type.replace("_", " ")}.` }
    }
    if (file instanceof File && file.size > MAX_FILE_BYTES) {
      return { success: false, error: "Each attached file must be smaller than 10MB." }
    }
  }

  const supabase = await createClient()

  const { data: application, error: applicationError } = await supabase
    .from("margaret_job_applications")
    .insert({
      job_id: parsed.data.jobId,
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      cover_letter: parsed.data.coverLetter || null,
      status: "submitted",
    })
    .select("id")
    .single()

  if (applicationError || !application) {
    return { success: false, error: "Something went wrong submitting your application. Please try again." }
  }

  for (const doc of DOCUMENT_FIELDS) {
    const file = formData.get(doc.field)
    if (!(file instanceof File) || file.size === 0) continue

    const path = `${application.id}/${doc.type}-${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("job-attachments")
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) continue

    await supabase.from("margaret_job_application_documents").insert({
      application_id: application.id,
      document_type: doc.type,
      file_url: path,
      file_name: file.name,
    })
  }

  return { success: true }
}

const clarificationSchema = z.object({
  tenderId: z.string().uuid(),
  tenderSlug: z.string().min(1),
  askedByName: z.string().trim().min(2, "Please enter your name.").max(200),
  askedByEmail: z.string().trim().email("Please enter a valid email address."),
  question: z.string().trim().min(10, "Please enter your question (at least 10 characters).").max(2000),
  honeypot: z.string().max(0).optional().or(z.literal("")),
})

export async function submitTenderClarification(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = clarificationSchema.safeParse({
    tenderId: formData.get("tenderId"),
    tenderSlug: formData.get("tenderSlug"),
    askedByName: formData.get("askedByName"),
    askedByEmail: formData.get("askedByEmail"),
    question: formData.get("question"),
    honeypot: formData.get("website") ?? "",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." }
  }

  if (parsed.data.honeypot) {
    return { success: true }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("margaret_tender_clarifications").insert({
    tender_id: parsed.data.tenderId,
    question: parsed.data.question,
    asked_by_name: parsed.data.askedByName,
    asked_by_email: parsed.data.askedByEmail,
    status: "pending",
  })

  if (error) {
    return { success: false, error: "Something went wrong submitting your question. Please try again." }
  }

  revalidatePath(`/tenders/${parsed.data.tenderSlug}`)
  return { success: true }
}
