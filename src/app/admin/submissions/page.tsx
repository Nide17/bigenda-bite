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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">User Submissions</h1>
        <p className="text-sm text-neutral-500 mt-1">Review community contributions and suggested edits.</p>
      </div>
      <AdminClient submissions={JSON.parse(JSON.stringify(submissions))} />
    </div>
  )
}
