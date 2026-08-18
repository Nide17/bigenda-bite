'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold text-[#1e1b4b] mb-3">Something went wrong</h1>
        <p className="text-neutral-600 mb-8">
          We apologize for the inconvenience. An unexpected error occurred while loading this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <a
            href="/en"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-neutral-300 text-[#1e1b4b] font-semibold rounded-lg hover:bg-neutral-50 transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}

