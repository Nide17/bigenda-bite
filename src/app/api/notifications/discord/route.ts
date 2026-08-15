import { NextResponse } from 'next/server'
import { sendDiscordNotification } from '@/lib/discord'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    await sendDiscordNotification(message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending Discord notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
