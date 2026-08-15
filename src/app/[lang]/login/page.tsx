import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm lang={lang} />
      </Suspense>
    </div>
  )
}