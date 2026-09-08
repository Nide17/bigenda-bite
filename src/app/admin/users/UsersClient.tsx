'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { SearchIcon, ShieldIcon, CheckCircle2Icon, XCircleIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

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

      toast.success('User updated successfully')
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user')
    } finally {
      setLoadingId(null)
      setConfirmAction(null)
    }
  }

  function handleAction(userId: string, action: string, data: Record<string, unknown>) {
    setConfirmAction({ userId, action, data })
  }

  return (
    <div className="space-y-6">
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[#1e1b4b] mb-2">Confirm action</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to {confirmAction.action} this user?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => updateUser(confirmAction.userId, confirmAction.data)}>
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
          >
            <option value="all">All roles</option>
            {VALID_ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="verified">Email verified</option>
            <option value="unverified">Email unverified</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
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
                  <tr key={u._id} className="hover:bg-neutral-50 transition-colors">
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
                        className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
                      >
                        {VALID_ROLES.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          u.banned
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {u.banned ? <XCircleIcon className="h-3 w-3" /> : <CheckCircle2Icon className="h-3 w-3" />}
                          {u.banned ? 'Banned' : 'Active'}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          u.emailVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {u.emailVerified ? <CheckCircle2Icon className="h-3 w-3" /> : <ShieldIcon className="h-3 w-3" />}
                          {u.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-neutral-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={u.banned ? 'primary' : 'danger'}
                          size="sm"
                          loading={loadingId === u._id}
                          onClick={() => handleAction(u._id, u.banned ? 'unban' : 'ban', { banned: !u.banned })}
                        >
                          {u.banned ? 'Unban' : 'Ban'}
                        </Button>
                        {!u.emailVerified && (
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={loadingId === u._id}
                            onClick={() => handleAction(u._id, 'verify email', { emailVerified: true })}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
