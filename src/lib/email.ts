import nodemailer from 'nodemailer'

interface MailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter

  const user = process.env.GMAIL_USER
  const password = process.env.GMAIL_PASSWORD

  if (!user || !password) {
    console.warn('GMAIL_USER or GMAIL_PASSWORD not set. Email sending disabled.')
    return null
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: password,
    },
  })

  return transporter
}

export async function sendMail({ to, subject, text, html }: MailOptions): Promise<boolean> {
  const mailer = getTransporter()
  if (!mailer) {
    console.log(`[Email disabled] Would send to ${to}: ${subject}`)
    return false
  }

  try {
    await mailer.sendMail({
      from: `"Bigenda Bite" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    })
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_PASSWORD)
}
