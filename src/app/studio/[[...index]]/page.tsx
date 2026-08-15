'use client'
import dynamic from 'next/dynamic'

const StudioClient = dynamic(() => import('@/components/StudioClient'), {
  ssr: false,
  loading: () => <p>Loading Studio...</p>,
})

export default function StudioPage() {
  return <StudioClient />
}
