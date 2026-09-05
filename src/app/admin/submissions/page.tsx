import { requireEditor } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import AdminClient from './AdminClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getSubmissions() {
  const db = await connectToDatabase()
  const submissions = db.collection('userSubmissions')

  const results = await submissions.find({}).sort({ createdAt: -1 }).limit(100).toArray()

  return results.map((submission) => ({
    ...submission,
    _id: submission._id.toString(),
  }))
}

export default async function AdminSubmissionsPage() {
  const auth = await requireEditor()
  if (auth.error) {
    redirect('/en/login')
    return
  }

  const submissions = await getSubmissions()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">User Submissions</h1>
      <AdminClient submissions={JSON.parse(JSON.stringify(submissions))} />
    </div>
  )
}
