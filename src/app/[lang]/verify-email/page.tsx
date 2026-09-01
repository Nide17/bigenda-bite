import { Suspense } from 'react'
import VerifyEmailContent from './VerifyEmailContent'
import PageContainer from '@/components/PageContainer'

export default async function VerifyEmailPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  return (
    <PageContainer maxWidth="sm">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full">
          <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
            <VerifyEmailContent lang={lang} />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  )
}
