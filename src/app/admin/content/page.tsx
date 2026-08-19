import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import ContentClient from './ContentClient'

export const dynamic = 'force-dynamic'

async function getPendingContent() {
  const db = await connectToDatabase()
  const pendingUpdates = await db.collection('pendingUpdates').find({}).sort({ detectedAt: -1 }).limit(50).toArray()

  return pendingUpdates.map((update) => ({
    _id: update._id.toString(),
    collection: update.collection,
    documentId: update.documentId,
    status: update.status,
    confidenceScore: update.confidenceScore,
    diffSummary: update.diffSummary,
    detectedAt: update.detectedAt?.toISOString() || new Date().toISOString(),
    approvedAt: update.approvedAt?.toISOString() || null,
    rejectedAt: update.rejectedAt?.toISOString() || null,
  }))
}

export default async function AdminContentPage() {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('next-auth.session-token')?.value || null)
  const user = session?.user

  if (!user || user.role !== 'editor') {
    redirect('/en/login')
  }

  const items = await getPendingContent()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Content Scheduling</h1>
      <ContentClient items={items} />
    </div>
  )
}
