import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { createClient } from '@sanity/client'
import AdminClient from './AdminClient'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import type { PendingUpdate, Process } from '@/types'

export const dynamic = 'force-dynamic'

function createSanityClient() {
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

async function getPendingUpdates(): Promise<PendingUpdate[]> {
  const db = await connectToDatabase()
  const pendingUpdates = db.collection('pendingUpdates')

  const rawUpdates = await pendingUpdates
    .find({ status: 'pending' })
    .sort({ detectedAt: -1 })
    .limit(50)
    .toArray()

  const updates = rawUpdates.map((update) => ({
    ...update,
    _id: update._id.toString(),
  })) as Array<PendingUpdate>

  const sanityClient = createSanityClient()
  const updatesWithCurrent = await Promise.all(
    updates.map(async (update) => {
      if (update.documentId && update.documentId.startsWith('process_')) {
        try {
          const current = await sanityClient.fetch<Process | null>(
            `*[_type == "process" && _id == $id][0]`,
            { id: update.documentId }
          )
          return { ...update, currentSanityDoc: current || null }
        } catch {
          return { ...update, currentSanityDoc: null }
        }
      }
      return { ...update, currentSanityDoc: null }
    })
  )

  return updatesWithCurrent
}

export default async function AdminPendingUpdatesPage() {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('next-auth.session-token')?.value || null)
  const user = session?.user

  if (!user || user.role !== 'editor') {
    redirect('/en/login')
  }

  const updatesWithCurrent = await getPendingUpdates()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Pending Content Updates</h1>
      <AdminClient updates={JSON.parse(JSON.stringify(updatesWithCurrent))} />
    </div>
  )
}
