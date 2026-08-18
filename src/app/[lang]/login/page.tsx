import { Suspense } from 'react'
import LoginForm from './LoginForm'
import PageContainer from '@/components/PageContainer'

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  return (
    <PageContainer maxWidth="sm">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
              BB
            </div>
            <h1 className="text-2xl font-bold text-primary mb-1">Welcome back</h1>
            <p className="text-sm text-neutral-600">Sign in to your Bigenda Bite account</p>
          </div>
          <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
            <LoginForm lang={lang} />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  )
}