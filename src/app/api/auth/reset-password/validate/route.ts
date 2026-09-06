import { NextResponse, NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields } from '@/lib/api/validate'

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJson<{ token: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['token'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { token } = parsed.data

    const db = await connectToDatabase()
    const passwordResets = db.collection('passwordResets')

    const resetRecord = await passwordResets.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!resetRecord) {
      const expired = await passwordResets.findOne({
        token,
        used: { $ne: true },
        expiresAt: { $lte: new Date() },
      })

      if (expired) {
        return NextResponse.json({ valid: false, reason: 'expired' }, { status: 400 })
      }

      const used = await passwordResets.findOne({
        token,
        used: true,
      })

      if (used) {
        return NextResponse.json({ valid: false, reason: 'used' }, { status: 400 })
      }

      return NextResponse.json({ valid: false, reason: 'not_found' }, { status: 400 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Validate reset token error:', error)
    return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 })
  }
}
