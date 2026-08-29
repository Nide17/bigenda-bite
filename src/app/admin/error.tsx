'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Admin page error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold text-primary mb-3">Admin Panel Error</h1>
        <p className="text-neutral-600 mb-8">
          We couldn&apos;t load this section of the admin panel. Please try again or return to the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-neutral-300 text-primary font-semibold rounded-lg hover:bg-neutral-50 transition-all"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
