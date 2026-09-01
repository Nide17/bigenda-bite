'use client'

import { useState, useMemo } from 'react'

export interface UserRecord {
  _id: string
  displayName: string
  email: string
  role: string
  banned: boolean
  emailVerified: boolean
  createdAt: string
}

const VALID_ROLES = ['reader', 'editor', 'admin', 'superadmin'] as const

export default function UsersClient({ users }: { users: UserRecord[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [confirmAction, setConfirmAction] = useState<{ userId: string; action: string; data: Record<string, unknown> } | null>(null)

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.displayName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())

      const matchesRole = roleFilter === 'all' || u.role === roleFilter

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !u.banned) ||
        (statusFilter === 'banned' && u.banned) ||
        (statusFilter === 'verified' && u.emailVerified) ||
        (statusFilter === 'unverified' && !u.emailVerified)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

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

      setMessage({ type: 'success', text: 'User updated successfully' })
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update user' })
    } finally {
      setLoadingId(null)
      setConfirmAction(null)
    }
  }

  function handleAction(userId: string, action: string, data: Record<string, unknown>) {
    setConfirmAction({ userId, action, data })
  }

  function getRoleBadgeColor(role: string) {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800'
      case 'admin':
        return 'bg-blue-100 text-blue-800'
      case 'editor':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-4 rounded border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-primary mb-2">Confirm action</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to {confirmAction.action} this user?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateUser(confirmAction.userId, confirmAction.data)}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All roles</option>
          {VALID_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="verified">Email verified</option>
          <option value="unverified">Email unverified</option>
        </select>
      </div>

      <div className="text-sm text-neutral-500">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      <div className="overflow-x-auto border border-neutral-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left p-3 font-semibold text-neutral-700">User</th>
              <th className="text-left p-3 font-semibold text-neutral-700">Role</th>
              <th className="text-left p-3 font-semibold text-neutral-700">Status</th>
              <th className="text-left p-3 font-semibold text-neutral-700">Created</th>
              <th className="text-left p-3 font-semibold text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-neutral-500 text-center">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-neutral-50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-neutral-900">{u.displayName}</div>
                      <div className="text-xs text-neutral-500">{u.email}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleAction(u._id, `change role to ${e.target.value}`, { role: e.target.value })}
                      disabled={loadingId === u._id}
                      className="border border-neutral-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {VALID_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${u.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {u.banned ? 'Banned' : 'Active'}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${u.emailVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {u.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-neutral-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(u._id, u.banned ? 'unban' : 'ban', { banned: !u.banned })}
                        disabled={loadingId === u._id}
                        className={`px-3 py-1 rounded text-white text-xs ${u.banned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}
                      >
                        {u.banned ? 'Unban' : 'Ban'}
                      </button>
                      {!u.emailVerified && (
                        <button
                          onClick={() => handleAction(u._id, 'verify email', { emailVerified: true })}
                          disabled={loadingId === u._id}
                          className="px-3 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                          Verify
                        </button>
                      )}
                    </div>
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
