/**
 * Conversion events for GA4.
 *
 * Only fires when an administrator has set a real Measurement ID in Settings —
 * with no ID, `gtag` never loads and every call here is a silent no-op, so
 * callers never have to check.
 *
 * Nothing here may carry patient information. A hospital's analytics must
 * record THAT an appointment was requested, never who requested it or why:
 * names, phone numbers, dates of birth and anything about a condition stay out
 * of the payload. That is both Google's policy on sensitive data and the
 * ordinary duty of care under Kenya's Data Protection Act, 2019.
 */
type GtagWindow = Window & {
  gtag?: (command: string, eventName: string, params?: Record<string, string | number>) => void
}

export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return
  const { gtag } = window as GtagWindow
  if (typeof gtag !== "function") return
  gtag("event", name, params)
}

/** A visitor asked for an appointment. No patient details, only the department. */
export const trackAppointmentRequest = (department?: string) =>
  trackEvent("appointment_request", department ? { department } : {})

/** A visitor sent the contact form. */
export const trackContactSubmit = () => trackEvent("contact_submit")

/** A visitor tapped a phone number. `context` says which one, e.g. "emergency". */
export const trackPhoneClick = (context: string) => trackEvent("phone_click", { context })
