'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTrackEvent } from '@/lib/use-analytics'

interface Ad {
  _id: string
  title: string
  imageUrl: string
  linkUrl: string
  placement: string
  city?: string
}

interface AdBannerProps {
  placement: 'sidebar' | 'top' | 'bottom' | 'inline'
  city?: string
}

export default function AdBanner({ placement, city }: AdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const trackAdClick = useTrackEvent('ad_click', { placement, city })

  useEffect(() => {
    const params = new URLSearchParams({ placement })
    if (city) params.set('city', city)

    fetch(`/api/ads?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setAds(data)
        setLoading(false)

        if (data.length > 0) {
          trackImpression(data[0]._id)
        }
      })
      .catch(() => setLoading(false))
  }, [placement, city])

  const trackImpression = async (adId: string) => {
    await fetch('/api/ads/impression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId }),
    })
  }

  const handleClick = async (ad: Ad) => {
    trackAdClick()
    await fetch('/api/ads/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: ad._id }),
    })
    router.push(ad.linkUrl)
  }

  if (loading || ads.length === 0) return null

  const ad = ads[0]

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <img
        src={ad.imageUrl}
        alt={ad.title}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => handleClick(ad)}
      />
      <div className="p-3">
        <h3 className="font-semibold text-sm">{ad.title}</h3>
      </div>
    </div>
  )
}
