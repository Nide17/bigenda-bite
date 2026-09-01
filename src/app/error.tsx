'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">Something went wrong</h1>
        <p className="text-neutral-600 mb-6">
          We apologize for the inconvenience. An unexpected error occurred while loading this page.
        </p>

        {error.digest && (
          <p className="text-xs text-neutral-400 mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Link
            href="/en"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-neutral-300 text-primary font-semibold rounded-lg hover:bg-neutral-50 transition-all"
          >
            Go Home
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          <Link
            href="/en/processes"
            className="flex items-center justify-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <span>📋</span>
            <span className="text-sm font-medium text-neutral-700">Processes</span>
          </Link>
          <Link
            href="/en/guides"
            className="flex items-center justify-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <span>📖</span>
            <span className="text-sm font-medium text-neutral-700">Guides</span>
          </Link>
          <Link
            href="/en/directory"
            className="flex items-center justify-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <span>🏢</span>
            <span className="text-sm font-medium text-neutral-700">Directory</span>
          </Link>
          <Link
            href="/en/search"
            className="flex items-center justify-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <span>🔍</span>
            <span className="text-sm font-medium text-neutral-700">Search</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
