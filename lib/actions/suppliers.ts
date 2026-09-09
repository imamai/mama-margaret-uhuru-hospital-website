"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/actions/forms"

const registerSchema = z
  .object({
    companyName: z.string().trim().min(2, "Please enter your company name.").max(200),
    contactPerson: z.string().trim().min(2, "Please enter a contact person.").max(200),
    email: z.string().trim().email("Please enter a valid email address."),
    phone: z.string().trim().min(7, "Please enter a valid phone number.").max(30),
    registrationNumber: z.string().trim().max(100).optional().or(z.literal("")),
    kraPin: z.string().trim().max(30).optional().or(z.literal("")),
    address: z.string().trim().max(300).optional().or(z.literal("")),
    categoryId: z.string().uuid().optional().or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type SupplierRegisterResult = ActionResult | { success: true; needsEmailConfirmation: true }

const MAX_REGISTRATION_DOC_BYTES = 10 * 1024 * 1024

const REGISTRATION_DOCUMENT_FIELDS = [
  { field: "kraPinCertificate", documentType: "kra_pin_certificate", title: "KRA PIN Certificate", required: true },
  {
    field: "businessRegistrationCertificate",
    documentType: "business_registration_certificate",
    title: "Business Registration Certificate",
    required: true,
  },
  {
    field: "taxComplianceCertificate",
    documentType: "tax_compliance_certificate",
    title: "Tax Compliance Certificate",
    required: false,
  },
] as const

export async function registerSupplier(
  _prev: SupplierRegisterResult | null,
  formData: FormData
): Promise<SupplierRegisterResult> {
  const parsed = registerSchema.safeParse({
    companyName: formData.get("companyName"),
    contactPerson: formData.get("contactPerson"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    registrationNumber: formData.get("registrationNumber") ?? "",
    kraPin: formData.get("kraPin") ?? "",
    address: formData.get("address") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  for (const doc of REGISTRATION_DOCUMENT_FIELDS) {
    const file = formData.get(doc.field)
    if (doc.required && (!(file instanceof File) || file.size === 0)) {
      return { success: false, error: `Please attach your ${doc.title}.` }
    }
    if (file instanceof File && file.size > MAX_REGISTRATION_DOC_BYTES) {
      return { success: false, error: `${doc.title} must be smaller than 10MB.` }
    }
  }

  const supabase = await createClient()

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (signUpError || !signUpData.user) {
    return { success: false, error: signUpError?.message ?? "Could not create your account. Please try again." }
  }

  // Supabase deliberately returns a fake "success" response (no error, no new
  // session) when the email is already registered, so it doesn't leak which
  // emails exist. The giveaway is an empty identities array -- no new identity
  // was actually created, so the id above doesn't belong to a real new user
  // and inserting a supplier row against it would fail its FK constraint.
  if (signUpData.user.identities && signUpData.user.identities.length === 0) {
    return {
      success: false,
      error: "An account with this email already exists. Please log in instead, or use a different email address.",
    }
  }

  const { data: supplier, error: insertError } = await supabase
    .from("margaret_suppliers")
    .insert({
      user_id: signUpData.user.id,
      company_name: parsed.data.companyName,
      contact_person: parsed.data.contactPerson,
      email: parsed.data.email,
      phone: parsed.data.phone,
      registration_number: parsed.data.registrationNumber || null,
      kra_pin: parsed.data.kraPin || null,
      address: parsed.data.address || null,
      category_id: parsed.data.categoryId || null,
      status: "pending",
    })
    .select("id")
    .single()

  if (insertError || !supplier) {
    return { success: false, error: "Your account was created but the supplier profile could not be saved. Please contact us." }
  }

  for (const doc of REGISTRATION_DOCUMENT_FIELDS) {
    const file = formData.get(doc.field)
    if (!(file instanceof File) || file.size === 0) continue

    const path = `suppliers/${supplier.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("supplier-documents")
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) continue

    await supabase.from("margaret_supplier_documents").insert({
      supplier_id: supplier.id,
      document_type: doc.documentType,
      title: doc.title,
      file_url: path,
    })
  }

  if (!signUpData.session) {
    return { success: true, needsEmailConfirmation: true }
  }

  redirect("/suppliers/dashboard")
}

export async function supplierSignIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { success: false, error: "Please enter your email and password." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, error: "Incorrect email or password." }
  }

  redirect("/suppliers/dashboard")
}

export async function supplierSignOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/suppliers/login")
}

const MAX_BID_FILE_BYTES = 15 * 1024 * 1024

export async function submitBid(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const tenderId = String(formData.get("tenderId") ?? "")
  const bidAmountRaw = formData.get("bidAmount")
  const notes = String(formData.get("notes") ?? "")

  if (!tenderId) return { success: false, error: "Missing tender." }

  const bidAmount = bidAmountRaw ? Number(bidAmountRaw) : null
  if (bidAmountRaw && (Number.isNaN(bidAmount) || (bidAmount ?? 0) < 0)) {
    return { success: false, error: "Please enter a valid bid amount." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Please log in as a supplier to submit a bid." }
  }

  const { data: supplier } = await supabase
    .from("margaret_suppliers")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!supplier) {
    return { success: false, error: "No supplier profile found for your account." }
  }

  if (supplier.status !== "approved") {
    return { success: false, error: "Your supplier account is not yet approved to submit bids." }
  }

  const { data: bid, error: bidError } = await supabase
    .from("margaret_bids")
    .insert({
      tender_id: tenderId,
      supplier_id: supplier.id,
      bid_amount: bidAmount,
      notes: notes || null,
      status: "submitted",
    })
    .select("id")
    .single()

  if (bidError || !bid) {
    return { success: false, error: "You may have already submitted a bid for this tender, or something went wrong." }
  }

  const files = formData.getAll("documents").filter((f): f is File => f instanceof File && f.size > 0)

  for (const file of files) {
    if (file.size > MAX_BID_FILE_BYTES) continue

    const path = `bids/${bid.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("tender-documents")
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) continue

    await supabase.from("margaret_bid_documents").insert({
      bid_id: bid.id,
      title: file.name,
      file_url: path,
    })
  }

  revalidatePath("/suppliers/dashboard")
  return { success: true }
}
