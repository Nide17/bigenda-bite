import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

const messagesMap: Record<string, { common: Record<string, string> }> = { en: { common: messagesEn }, fr: { common: messagesFr }, rw: { common: messagesRw } }

export default async function MembershipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages.common?.[key] || key

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0',
      description: 'Basic listing, no lead capture',
      features: ['Basic listing', 'Contact button', 'Standard placement'],
      cta: 'Get Started',
      href: `/${lang}/register`,
      popular: false,
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '2,000',
      description: 'Verified badge, contact button, better placement',
      features: ['Verified badge', 'Contact button', 'Better placement', 'Analytics dashboard'],
      cta: 'Choose Basic',
      href: `/${lang}/membership/checkout?plan=basic`,
      popular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '5,000',
      description: 'Lead form + analytics, featured spot',
      features: ['Lead form + analytics', 'Featured spot', 'Priority support', 'Custom badge'],
      cta: 'Choose Pro',
      href: `/${lang}/membership/checkout?plan=pro`,
      popular: false,
    },
  ]

  return (
    <PageContainer maxWidth="lg">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{t('membership')}</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Choose the right plan for your business. All plans include a basic listing in our directory.
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
                  Most Popular
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-primary mb-1">{plan.name}</h2>
              <p className="text-3xl font-bold text-primary mb-2">
                {plan.price === '0' ? 'Free' : `${plan.price} RWF`}
              </p>
              <p className="text-sm text-neutral-600">{plan.description}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-700">{feature}</span>
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
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
