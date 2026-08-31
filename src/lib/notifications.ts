import { connectToDatabase } from '@/lib/db/mongodb'
import { sendMail } from '@/lib/email'

const NOTIFICATIONS_COLLECTION = 'notifications'

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  metadata?: Record<string, unknown>,
  options?: { sendEmail?: boolean }
) {
  const db = await connectToDatabase()

  const result = await db.collection(NOTIFICATIONS_COLLECTION).insertOne({
    userId,
    type,
    title,
    body,
    read: false,
    metadata: metadata || null,
    createdAt: new Date(),
  })

  if (options?.sendEmail) {
    const users = db.collection('users')
    const { ObjectId } = await import('mongodb')
    const user = await users.findOne({ _id: new ObjectId(userId) })

    if (user?.email) {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

      await sendMail({
        to: user.email,
        subject: title,
        text: body,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="width: 48px; height: 48px; background: #1e1b4b; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">BB</div>
            </div>
            <h2 style="color: #1e1b4b; margin-bottom: 16px;">${title}</h2>
            <p style="color: #404040; line-height: 1.5;">${body}</p>
            <a href="${baseUrl}/en" style="display: inline-block; background: #1e1b4b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Open Bigenda Bite</a>
          </div>
        `,
      })
    }
  }

  return result.insertedId.toString()
}

export async function getUserNotifications(userId: string, limit = 20) {
  const db = await connectToDatabase()

  const notifications = await db
    .collection(NOTIFICATIONS_COLLECTION)
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return notifications.map((n) => ({
    id: n._id.toString(),
    userId: n.userId,
    type: n.type,
    title: n.title,
    body: n.body,
    read: n.read,
    metadata: n.metadata,
    createdAt: n.createdAt,
  }))
}

export async function markNotificationRead(notificationId: string) {
  const db = await connectToDatabase()

  await db.collection(NOTIFICATIONS_COLLECTION).updateOne(
    { _id: new (await import('mongodb')).ObjectId(notificationId) },
    { $set: { read: true } }
  )
}

export async function markAllNotificationsRead(userId: string) {
  const db = await connectToDatabase()

  await db.collection(NOTIFICATIONS_COLLECTION).updateMany(
    { userId, read: false },
    { $set: { read: true } }
  )
}

export async function getUnreadCount(userId: string) {
  const db = await connectToDatabase()

  return await db
    .collection(NOTIFICATIONS_COLLECTION)
    .countDocuments({ userId, read: false })
}

