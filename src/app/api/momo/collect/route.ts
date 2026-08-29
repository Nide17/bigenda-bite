import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { createPayment, MoMoConfig } from '@/lib/momo'
import { parseJson, requireFields, fail } from '@/lib/api/validate'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const parsed = await parseJson<{ planId: string; amount: number; phoneNumber: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['planId', 'amount', 'phoneNumber'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { planId, amount, phoneNumber } = parsed.data

    if (amount <= 0) {
      return NextResponse.json(fail('Amount must be greater than 0'), { status: 400 })
    }

    const config: MoMoConfig = {
      apiUser: process.env.MOMO_API_USER!,
      apiKey: process.env.MOMO_API_KEY!,
      subscriptionKey: process.env.MOMO_SUBSCRIPTION_KEY!,
      environment: (process.env.MOMO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    }

    const externalId = `payment_${Date.now()}_${session.user.id}`
    const result = await createPayment(config, {
      amount,
      phoneNumber,
      externalId,
      payerMessage: `Payment for ${planId} plan`,
      payeeNote: 'Bigenda Bite membership',
    })

    const db = await connectToDatabase()
    await db.collection('payments').insertOne({
      userId: session.user.id,
      planId,
      amount,
      phoneNumber,
      transactionId: result.transactionId,
      status: result.status,
      externalId,
      createdAt: new Date(),
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('MoMo collect error:', error)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}


