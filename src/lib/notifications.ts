import { connectToDatabase } from '@/lib/db/mongodb'

const NOTIFICATIONS_COLLECTION = 'notifications'

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  metadata?: Record<string, unknown>
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

