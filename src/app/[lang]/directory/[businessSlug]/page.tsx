import { connectToDatabase } from '@/lib/db/mongodb'
import { notFound } from 'next/navigation'
import PageContainer from '@/components/PageContainer'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import type { Business } from '@/types'
import { pageMetadata, breadcrumbJsonLd, localBusinessJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'

const baseUrl = 'https://bigendabite.com'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string; businessSlug: string }> }): Promise<Metadata> {
  const { lang, businessSlug } = await params
  const db = await connectToDatabase()
  const business = await db.collection('businesses').findOne({ slug: businessSlug }) as Business | null
  if (!business) return pageMetadata({ title: 'Business Not Found', description: 'The requested business could not be found.', pathname: `/directory/${businessSlug}`, locale: lang })

  const title = business.name
  const description = business.description || `${business.category} in ${business.city || 'Rwanda'}.`
  const pathname = `/directory/${business.slug || business._id.toString()}`

  return pageMetadata({
    title: `${title} | Bigenda Bite`,
    description,
    pathname,
    locale: lang,
    keywords: [business.category || '', business.city || 'Rwanda', 'business', title],
  })
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ lang: string; businessSlug: string }> }) {
  const { lang, businessSlug } = await params
  const db = await connectToDatabase()
  const business = await db.collection('businesses').findOne({ slug: businessSlug }) as Business | null
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  if (!business) {
    notFound()
  }

  const breadcrumbLd = breadcrumbJsonLd(baseUrl, [
    { name: t('directory'), url: `/${lang}/directory` },
    { name: business.name, url: `/${lang}/directory/${business.slug || business._id.toString()}` },
  ])

  const localBusinessLd = localBusinessJsonLd(baseUrl, {
    name: business.name,
    category: business.category,
    city: business.city,
    slug: business.slug || business._id.toString(),
    lang,
    contact: business.contact,
  })

  return (
    <PageContainer maxWidth="lg">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={localBusinessLd} />
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: t('directory'), href: `/${lang}/directory` },
            { label: business.name },
          ]}
        />
      </div>

      <Card className="p-6 md:p-8 mb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{business.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {business.category}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {business.city || 'Nationwide'}
              </span>
            </div>
          </div>
          {business.leadsEnabled && (
            <Badge variant="success">Accepting Leads</Badge>
          )}
        </div>

        {business.contact?.phone && (
          <div className="flex items-center gap-2 text-neutral-700 mb-6">
            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${business.contact.phone}`} className="font-medium hover:text-primary transition-colors">
              {business.contact.phone}
            </a>
          </div>
        )}

        {business.description && (
          <p className="text-neutral-700 leading-relaxed mb-8">{business.description}</p>
        )}

        {business.leadsEnabled && (
          <Card className="p-6 bg-primary-light border-primary/10">
            <h2 className="text-xl font-semibold text-primary mb-2">Contact this business</h2>
            <p className="text-sm text-neutral-600 mb-4">
              Send a message directly to {business.name}. They will get back to you shortly.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Your name" type="text" placeholder="Your name" required />
                <Input label="Your phone" type="tel" placeholder="+250788000000" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
                <textarea
                  placeholder="Tell them what you need..."
                  rows={4}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <Button type="submit" size="lg">Send Message</Button>
            </form>
          </Card>
        )}
      </Card>
    </PageContainer>
  )
}
