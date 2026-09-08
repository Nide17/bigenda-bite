import { requireEditor } from '@/lib/auth/authorize'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboardIcon,
  RefreshCcwIcon,
  FileTextIcon,
  CheckSquareIcon,
  BarChart3Icon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const navItems = [
  { href: '/admin/pending-updates', label: 'Pending Updates', icon: RefreshCcwIcon },
  { href: '/admin/submissions', label: 'Submissions', icon: CheckSquareIcon },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3Icon },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/content', label: 'Content', icon: FileTextIcon },
  { href: '/admin/ads', label: 'Ads', icon: SettingsIcon },
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
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="hidden md:flex w-64 bg-white border-r border-neutral-200 flex-col">
        <div className="p-5 border-b border-neutral-200">
          <Link href="/admin/pending-updates" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1e1b4b] rounded-lg flex items-center justify-center text-white">
              <LayoutDashboardIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1e1b4b]">Admin</h2>
              <p className="text-xs text-neutral-500 truncate max-w-[10rem]">{user.email}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOutIcon className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <Link href="/admin/pending-updates" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1e1b4b] rounded-lg flex items-center justify-center text-white">
              <LayoutDashboardIcon className="h-4 w-4" />
            </div>
            <span className="font-semibold text-[#1e1b4b]">Admin</span>
          </Link>
          <span className="text-xs text-neutral-500 truncate max-w-[12rem]">{user.email}</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
