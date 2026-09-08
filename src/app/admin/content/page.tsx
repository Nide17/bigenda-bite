import { requireEditor } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { redirect } from 'next/navigation'
import ContentClient from './ContentClient'
import type { PendingUpdate } from '@/types'

export const dynamic = 'force-dynamic'

async function getPendingContent(): Promise<PendingUpdate[]> {
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
  const auth = await requireEditor()
  if (auth.error) {
    redirect('/en/login')
    return
  }

  const items = await getPendingContent()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">Content Scheduling</h1>
        <p className="text-sm text-neutral-500 mt-1">Review and approve content updates before publishing.</p>
      </div>
      <ContentClient items={items} />
    </div>
  )
}
