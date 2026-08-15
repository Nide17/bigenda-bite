import { Suspense } from 'react'
import RegisterForm from './RegisterForm'

export default async function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm lang={lang} />
    </Suspense>
  )
}