import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { checkPaymentStatus, MoMoConfig } from '@/lib/momo'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    maxRequests: 10,
    windowMs: 60 * 1000,
    keyGenerator: (req) => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      return `momo-status:${ip}`
    },
  })

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetAt)
  }
  try {
    const auth = await requireAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId is required' }, { status: 400 })
    }

    const config: MoMoConfig = {
      apiUser: process.env.MOMO_API_USER!,
      apiKey: process.env.MOMO_API_KEY!,
      subscriptionKey: process.env.MOMO_SUBSCRIPTION_KEY!,
      environment: (process.env.MOMO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    }

    const status = await checkPaymentStatus(config, transactionId)

    const db = await connectToDatabase()
    await db.collection('payments').updateOne(
      { transactionId },
      { $set: { status: status.status, updatedAt: new Date() } }
    )

    return NextResponse.json(status)
  } catch (error) {
    console.error('MoMo status error:', error)
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}


