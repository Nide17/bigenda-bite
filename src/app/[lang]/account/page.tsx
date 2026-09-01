import { Suspense } from 'react'
import AccountSettingsContent from './AccountSettingsContent'
import PageContainer from '@/components/PageContainer'

export default async function AccountSettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  return (
    <PageContainer maxWidth="md">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">Account Settings</h1>
          <p className="text-sm text-neutral-600 mt-1">Manage your profile and security settings</p>
        </div>
        <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
          <AccountSettingsContent lang={lang} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
