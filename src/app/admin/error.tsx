'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { LayoutDashboardIcon } from 'lucide-react'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Admin page error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4">
          <LayoutDashboardIcon className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#1e1b4b] mb-2">Something went wrong</h1>
        <p className="text-neutral-600 mb-6">
          This admin section is temporarily unavailable. Please try again or return to the dashboard.
        </p>

        {error.digest && (
          <p className="text-xs text-neutral-400 mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-neutral-300 text-[#1e1b4b] font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
