import { requireEditor } from '@/lib/auth/authorize'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const navItems = [
  { href: '/admin/pending-updates', label: 'Pending Updates' },
  { href: '/admin/submissions', label: 'Submissions' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/ads', label: 'Ads' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await requireEditor()
  if (auth.error) {
    redirect('/en/login')
    return
  }
  const user = auth.session!.user

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Admin</h2>
          <p className="text-sm text-gray-400 mt-1">{user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}



