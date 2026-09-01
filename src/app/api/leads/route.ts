import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields } from '@/lib/api/validate'
import { sendMail } from '@/lib/email'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    const parsed = await parseJson<{ businessId: string; contactName: string; contactPhone: string; message?: string; source?: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['businessId', 'contactName', 'contactPhone'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { businessId, contactName, contactPhone, message, source } = parsed.data

    const db = await connectToDatabase()
    const leads = db.collection('leads')

    await leads.insertOne({
      businessId,
      contactName,
      contactPhone,
      message: message || null,
      source: source || 'directory_page',
      status: 'new',
      createdAt: new Date(),
    })

    const business = await db.collection('businesses').findOne({ _id: new ObjectId(businessId) })
    const businessEmail = business?.email || business?.contact?.email

    if (businessEmail && business?.name) {
      const leadMessage = message ? `\n\nMessage: ${message}` : ''
      await sendMail({
        to: businessEmail,
        subject: `New lead from ${contactName} - Bigenda Bite`,
        text: `Hi ${business.name},

You have received a new lead from Bigenda Bite:

Name: ${contactName}
Phone: ${contactPhone}${leadMessage}

Please contact them as soon as possible.

Best regards,
Bigenda Bite Team`,
        html: `<p>Hi <strong>${business.name}</strong>,</p>
<p>You have received a new lead from Bigenda Bite:</p>
<table style="border-collapse: collapse; margin: 16px 0;">
  <tr><td style="padding: 8px 16px 8px 0; font-weight: bold;">Name:</td><td>${contactName}</td></tr>
  <tr><td style="padding: 8px 16px 8px 0; font-weight: bold;">Phone:</td><td>${contactPhone}</td></tr>
  ${message ? `<tr><td style="padding: 8px 16px 8px 0; font-weight: bold;">Message:</td><td>${message}</td></tr>` : ''}
</table>
<p>Please contact them as soon as possible.</p>
<p>Best regards,<br>Bigenda Bite Team</p>`,
      })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
