import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson } from '@/lib/api/validate'

const MAX_WEBHOOK_PAYLOAD_SIZE = 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > MAX_WEBHOOK_PAYLOAD_SIZE) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }

    const signature = request.headers.get('x-momo-signature') || request.headers.get('x-signature')
    const subscriptionKey = request.headers.get('x-subscription-key') || request.headers.get('x-api-key')

    if (!signature || !subscriptionKey) {
      return NextResponse.json({ error: 'Missing webhook authentication headers' }, { status: 401 })
    }

    const expectedKey = process.env.MOMO_SUBSCRIPTION_KEY || process.env.MOMO_API_KEY
    if (!expectedKey) {
      console.error('MoMo webhook: MOMO_SUBSCRIPTION_KEY or MOMO_API_KEY not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    if (subscriptionKey !== expectedKey) {
      return NextResponse.json({ error: 'Invalid subscription key' }, { status: 401 })
    }

    const bodyText = await request.text()
    
    try {
      const body = JSON.parse(bodyText) as { transactionId?: string; status?: string; amount?: { transactionId?: string; status?: string } }
      
    const transactionId = body.transactionId || body.amount?.transactionId
    const status = body.status || body.amount?.status

    if (!transactionId || !status) {
      return NextResponse.json({ error: 'Missing transactionId or status' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection('payments').updateOne(
      { transactionId },
      {
        $set: {
          status: status.toUpperCase(),
          updatedAt: new Date(),
          webhookPayload: body,
          webhookVerified: true,
          webhookReceivedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json({ received: true })
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }
  } catch (error) {
    console.error('MoMo webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'MoMo webhook endpoint' })
}

