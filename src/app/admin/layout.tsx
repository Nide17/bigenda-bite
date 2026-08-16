import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const navItems = [
  { href: '/admin/pending-updates', label: 'Pending Updates' },
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
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('next-auth.session-token')?.value || null)
  const user = session?.user

  if (!user || user.role !== 'editor') {
    redirect('/en/login')
  }

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
