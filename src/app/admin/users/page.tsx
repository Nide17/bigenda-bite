import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import UsersClient from './UsersClient'

export const dynamic = 'force-dynamic'

async function getUsers() {
  const db = await connectToDatabase()
  const users = await db.collection('users').find({}).sort({ createdAt: -1 }).limit(100).toArray()

  return users.map((u) => ({
    _id: u._id.toString(),
    displayName: u.displayName || '',
    email: u.email || '',
    role: u.role || 'reader',
    banned: u.banned || false,
    createdAt: u.createdAt?.toISOString() || new Date().toISOString(),
  }))
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('next-auth.session-token')?.value || null)
  const user = session?.user

  if (!user || user.role !== 'editor') {
    redirect('/en/login')
  }

  const serializedUsers = await getUsers()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>
      <UsersClient users={serializedUsers} />
    </div>
  )
}
