import "server-only"

import { Resend } from "resend"

/**
 * Sending email as the hospital.
 *
 * Supabase can send auth emails itself, but its SMTP settings belong to the
 * whole project -- and this project is shared with seven other sites. Setting
 * the sender there to the hospital would make jemvoyage, kida, mejasan and the
 * rest send their password resets as Mama Margaret Uhuru Hospital too.
 *
 * So this site sends its own, with its own key and its own from-address, and
 * leaves every other site exactly as it was.
 */

export type EmailResult = { sent: true } | { sent: false; reason: string }

export function canSendEmail(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    return { sent: false, reason: "Email is not configured -- set RESEND_API_KEY and RESEND_FROM_EMAIL." }
  }

  try {
    const resend = new Resend(apiKey)
    // A plain-text part as well as HTML: some mail clients show only the text,
    // and a message with no text part scores worse with spam filters.
    const { error } = await resend.emails.send({
      from: `Mama Margaret Uhuru Hospital <${from}>`,
      to,
      subject,
      html,
      text,
    })
    if (error) return { sent: false, reason: error.message }
    return { sent: true }
  } catch (cause) {
    return { sent: false, reason: cause instanceof Error ? cause.message : "Could not send the email." }
  }
}

/**
 * The reset email itself.
 *
 * Deliberately plain. A password email that looks like marketing is a password
 * email people distrust, and a hospital cannot afford to train its suppliers
 * and staff to ignore the difference between this and a phishing attempt. It
 * says who it is for, what to do, and what to do if it was not them.
 */
export function passwordResetEmail({
  link,
  audience,
}: {
  link: string
  audience: "supplier" | "staff"
}): { subject: string; html: string; text: string } {
  const who = audience === "supplier" ? "supplier account" : "staff account"
  const subject = "Reset your Mama Margaret Uhuru Hospital password"

  const text = [
    `Someone asked to reset the password for your ${who} at Mama Margaret Uhuru Hospital.`,
    "",
    "Open this link to choose a new password:",
    link,
    "",
    "The link can be used once and expires shortly.",
    "",
    "If this wasn't you, ignore this email -- your password has not changed.",
    "",
    "Mama Margaret Uhuru Hospital",
    "Outering Road, Off Kamunde Road, Nairobi",
  ].join("\n")

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f5f7f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#00603a;">
            Mama Margaret Uhuru Hospital
          </p>
          <h1 style="margin:12px 0 0;font-size:20px;line-height:1.3;color:#111827;">Reset your password</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 28px 0;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
            Someone asked to reset the password for your ${who}. Choose a new one here:
          </p>
          <p style="margin:0 0 20px;">
            <a href="${link}" style="display:inline-block;background:#00603a;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:15px;font-weight:600;">
              Set a new password
            </a>
          </p>
          <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#6b7280;">
            The link can be used once and expires shortly. If the button doesn't work, copy this address into your browser:
          </p>
          <p style="margin:0 0 20px;font-size:12px;line-height:1.5;word-break:break-all;color:#6b7280;">${link}</p>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;">
            If this wasn't you, you can ignore this email &mdash; your password has not changed.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 28px;border-top:1px solid #e5e7eb;">
          <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#6b7280;">
            Mama Margaret Uhuru Hospital<br />Outering Road, Off Kamunde Road, Nairobi
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return { subject, html, text }
}
