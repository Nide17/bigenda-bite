import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import PageContainer from '@/components/PageContainer'
import { getSession } from '@/lib/auth/session'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export const dynamic = 'force-dynamic'

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  const session = await getSession()
  if (session?.user) {
    redirect(`/${lang}/account`)
  }

  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  return (
    <PageContainer maxWidth="sm">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
              BB
            </div>
            <h1 className="text-2xl font-bold text-primary mb-1">{t('login_welcome_back')}</h1>
            <p className="text-sm text-neutral-600">{t('login_sign_in_text')}</p>
          </div>
          <Suspense fallback={<div className="text-center text-neutral-500">{t('loading')}</div>}>
            <LoginForm lang={lang} />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  )
}