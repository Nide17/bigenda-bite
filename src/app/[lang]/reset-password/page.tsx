import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'
import PageContainer from '@/components/PageContainer'
import { getMessages } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function ResetPasswordPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getMessages(lang)

  return (
    <PageContainer maxWidth="sm">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
              BB
            </div>
            <h1 className="text-2xl font-bold text-primary mb-1">{t('reset_password_title')}</h1>
            <p className="text-sm text-neutral-600">{t('reset_password_subtitle')}</p>
          </div>
          <Suspense fallback={<div className="text-center text-neutral-500">{t('loading')}</div>}>
            <ResetPasswordForm lang={lang} />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  )
}
