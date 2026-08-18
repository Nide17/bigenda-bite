'use client'

import { useState } from 'react'

export interface UserRecord {
  _id: string
  displayName: string
  email: string
  role: string
  banned: boolean
  createdAt: string
}

export default function UsersClient({ users }: { users: UserRecord[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function updateUser(userId: string, data: Record<string, unknown>) {
    setLoadingId(userId)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      })

      if (!res.ok) {
        const result = await res.json().catch(() => ({}))
        throw new Error(result.error || 'Failed to update user')
      }

      setMessage('User updated successfully')
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update user')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">{message}</div>
      )}

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Created</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-gray-500 text-center">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.displayName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateUser(u._id, { role: e.target.value })}
                      disabled={loadingId === u._id}
                      className="border rounded px-2 py-1"
                    >
                      <option value="reader">reader</option>
                      <option value="editor">editor</option>
                      <option value="user">user</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${u.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {u.banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => updateUser(u._id, { banned: !u.banned })}
                      disabled={loadingId === u._id}
                      className={`px-3 py-1 rounded text-white text-xs ${u.banned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}
                    >
                      {u.banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


