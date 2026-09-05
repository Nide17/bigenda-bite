import { NextResponse, NextRequest } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { parseJson, requireFields } from '@/lib/api/validate'
import { sendDiscordNotification } from '@/lib/discord'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireEditor()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const parsed = await parseJson<{ message?: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['message'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    await sendDiscordNotification(parsed.data.message!)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending Discord notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}

