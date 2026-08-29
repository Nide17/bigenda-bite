'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang='en'>
      <body className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-[#1e1b4b] mb-3">Application Error</h1>
          <p className="text-neutral-600 mb-8">
            We couldn&apos;t load the application. Please try again or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="primary">
              Try Again
            </Button>
            <Link
              href="/en"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-neutral-300 text-[#1e1b4b] font-semibold rounded-lg hover:bg-neutral-50 transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
