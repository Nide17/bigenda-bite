import CheckoutForm from './CheckoutForm'

export default async function CheckoutPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ plan?: string }> }) {
  const { lang } = await params
  const { plan } = await searchParams

  return <CheckoutForm planId={plan || 'basic'} />
}