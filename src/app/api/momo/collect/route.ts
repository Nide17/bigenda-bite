import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { createPayment, MoMoConfig } from '@/lib/momo'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const body = await request.json()
    const { planId, amount, phoneNumber } = body as { planId: string; amount: number; phoneNumber: string }

    if (!planId || !amount || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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


