import Link from 'next/link'
import PageContainer from '@/components/PageContainer'

export default function NotFound() {
  return (
    <PageContainer maxWidth="md">
      <div className="text-center py-16 md:py-24">
        <div className="text-8xl font-bold text-primary/10 mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Page Not Found</h1>
        <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/en"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/en/processes"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-300 text-primary font-semibold rounded-lg hover:bg-neutral-50 transition-all duration-150"
          >
            Browse Processes
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}