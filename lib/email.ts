import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const sender = process.env.SENDER_EMAIL || "onboarding@resend.dev"

const wrap = (body: string) => `<table width="100%" style="background:#FDFBF7;font-family:'Nunito',Arial,sans-serif;padding:24px 0"><tr><td align="center"><table width="540" style="background:white;border-radius:24px;padding:32px;box-shadow:0 8px 30px rgba(0,0,0,0.04)"><tr><td style="padding-bottom:16px;border-bottom:1px solid #FFF9E6"><span style="font-family:'Fredoka',Arial,sans-serif;font-size:24px;font-weight:600;color:#E07A5F">Stavi</span></td></tr><tr><td style="padding-top:24px;color:#2B2D42;font-size:16px;line-height:1.7">${body}</td></tr><tr><td style="padding-top:24px;font-size:12px;color:#8D99AE">Grandir avec amour, une page à la fois. 💛</td></tr></table></td></tr></table>`

export async function sendEmail(to: string, subject: string, body: string, attachment?: { filename: string; content: Buffer }) {
  if (!resend) { console.warn("[email] RESEND_API_KEY not set — skipped:", subject); return false }
  try {
    await resend.emails.send({ from: `Stavi <${sender}>`, to: [to], subject, html: wrap(body), ...(attachment ? { attachments: [{ filename: attachment.filename, content: attachment.content }] } : {}) })
    return true
  } catch (e) { console.error("[email]", e); return false }
}
