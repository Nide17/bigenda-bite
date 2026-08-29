'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  const trackAdClick = useTrackEvent('ad_click', { placement, city })

  const trackImpression = async (adId: string) => {
    await fetch('/api/ads/impression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId }),
    })
  }

  useEffect(() => {
    const params = new URLSearchParams({ placement })
    if (city) params.set('city', city)

    fetch(`/api/ads?${params}`)
      .then((res) => res.json())
      .then((data) => {
        const adsArray = Array.isArray(data) ? data : []
        setAds(adsArray)
        setLoading(false)
        setImageError(false)

        if (adsArray.length > 0 && adsArray[0]?._id) {
          trackImpression(adsArray[0]._id)
        }
      })
      .catch(() => setLoading(false))
  }, [placement, city])

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

  if (!ad || !ad.imageUrl) {
    return (
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div
          className="w-full h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center cursor-pointer"
          onClick={() => handleClick(ad)}
        >
          <div className="text-center p-4">
            <div className="text-3xl mb-2">📢</div>
            <p className="text-sm font-medium text-neutral-700 line-clamp-2">{ad?.title || 'Advertisement'}</p>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm">{ad?.title || 'Advertisement'}</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      {imageError ? (
        <div
          className="w-full h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center cursor-pointer"
          onClick={() => handleClick(ad)}
        >
          <div className="text-center p-4">
            <div className="text-3xl mb-2">📢</div>
            <p className="text-sm font-medium text-neutral-700 line-clamp-2">{ad.title}</p>
          </div>
        </div>
      ) : (
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          width={600}
          height={192}
          unoptimized
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => handleClick(ad)}
          onError={() => setImageError(true)}
        />
      )}
      <div className="p-3">
        <h3 className="font-semibold text-sm">{ad.title}</h3>
      </div>
    </div>
  )
}


