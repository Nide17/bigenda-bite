import CheckoutForm from './CheckoutForm'

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams

  return <CheckoutForm planId={plan || 'basic'} />
}