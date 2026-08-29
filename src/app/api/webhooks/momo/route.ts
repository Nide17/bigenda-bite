import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson } from '@/lib/api/validate'

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJson<{ transactionId?: string; status?: string; amount?: { transactionId?: string; status?: string } }>(request)
    if (!parsed.ok) return parsed.response

    const body = parsed.data
    const transactionId = body.transactionId || body.amount?.transactionId
    const status = body.status || body.amount?.status

    if (!transactionId || !status) {
      return NextResponse.json({ error: 'Missing transactionId or status' }, { status: 400 })
    }

    const db = await connectToDatabase()
    await db.collection('payments').updateOne(
      { transactionId },
      {
        $set: {
          status: status.toUpperCase(),
          updatedAt: new Date(),
          webhookPayload: body,
        },
      }
    )

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('MoMo webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'MoMo webhook endpoint' })
}

