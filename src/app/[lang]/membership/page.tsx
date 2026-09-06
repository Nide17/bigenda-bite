import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getMessages } from '@/lib/i18n'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    title: 'Membership | Bigenda Bite',
    description: 'Choose the right plan for your business. All plans include a basic listing in our directory.',
    pathname: '/membership',
    locale: lang,
    keywords: ['membership', 'subscription', 'business', 'Rwanda'],
  })
}

export default async function MembershipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getMessages(lang)

  const plans = [
    {
      id: 'free',
      nameKey: 'membership_plan_free',
      price: '0',
      descriptionKey: 'membership_plan_free_desc',
      featureKeys: ['membership_feature_basic_listing', 'membership_feature_contact_button', 'membership_feature_standard_placement'],
      ctaKey: 'get_started',
      href: `/${lang}/register`,
      popular: false,
    },
    {
      id: 'basic',
      nameKey: 'membership_plan_basic',
      price: '2,000',
      descriptionKey: 'membership_plan_basic_desc',
      featureKeys: ['membership_feature_verified_badge', 'membership_feature_contact_button', 'membership_feature_better_placement', 'membership_feature_analytics_dashboard'],
      ctaKey: 'choose_basic',
      href: `/${lang}/membership/checkout?plan=basic`,
      popular: true,
    },
    {
      id: 'pro',
      nameKey: 'membership_plan_pro',
      price: '5,000',
      descriptionKey: 'membership_plan_pro_desc',
      featureKeys: ['membership_feature_lead_form_analytics', 'membership_feature_featured_spot', 'membership_feature_priority_support', 'membership_feature_custom_badge'],
      ctaKey: 'choose_pro',
      href: `/${lang}/membership/checkout?plan=pro`,
      popular: false,
    },
  ]

  return (
    <PageContainer maxWidth="lg">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{t('membership')}</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          {t('membership_choose_plan_text')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white border rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-200 ${
              plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {t('most_popular')}
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-primary mb-1">{t(plan.nameKey)}</h2>
              <p className="text-3xl font-bold text-primary mb-2">
                {plan.price === '0' ? t('membership_price_free') : `${plan.price} RWF`}
              </p>
              <p className="text-sm text-neutral-600">{t(plan.descriptionKey)}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.featureKeys.map((featureKey) => (
                <li key={featureKey} className="flex items-start gap-2.5 text-sm">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-700">{t(featureKey)}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`block w-full text-center px-4 py-2.5 rounded-lg font-semibold transition-all duration-150 ${
                plan.popular
                  ? 'bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg'
                  : 'bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary/20'
              }`}
            >
              {t(plan.ctaKey)}
            </Link>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
