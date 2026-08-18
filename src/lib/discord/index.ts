export async function sendDiscordNotification(message: string, embeds?: any[]) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL not configured')
    return
  }

  try {
    const body: any = {
      content: message,
    }

    if (embeds && embeds.length > 0) {
      body.embeds = embeds
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error)
  }
}

export async function sendPendingUpdateNotification(update: {
  id: string
  sourceProcessId: string
  diffSummary: string
  confidenceScore: number
  detectedAt: string
  adminUrl?: string
}) {
  const embed: any = {
    title: '📋 Content Update Pending Review',
    description: update.diffSummary,
    color: 0xf59e0b,
    fields: [
      {
        name: 'Process ID',
        value: update.sourceProcessId,
        inline: true,
      },
      {
        name: 'Confidence',
        value: `${Math.round(update.confidenceScore * 100)}%`,
        inline: true,
      },
      {
        name: 'Detected At',
        value: new Date(update.detectedAt).toLocaleString(),
        inline: true,
      },
    ],
  }

  if (update.adminUrl) {
    embed.url = update.adminUrl
    embed.footer = {
      text: 'Bigenda Bite — Review in Admin Panel',
    }
  } else {
    embed.footer = {
      text: 'Bigenda Bite — Review in Admin Panel',
    }
  }

  await sendDiscordNotification(
    'A new content update has been detected and is awaiting your review.',
    [embed]
  )
}

