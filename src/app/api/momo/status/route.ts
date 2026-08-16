import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { checkPaymentStatus, MoMoConfig } from '@/lib/momo'

export async function GET(request: Request) {
  try {
    const session = await getSession((request as any).cookies?.get('next-auth.session-token')?.value || null)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
