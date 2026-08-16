'use client'

import { useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const API_ROUTE = '/api/analytics/track'

function getSessionId(): string {
  if (typeof document === 'undefined') return ''

  const match = document.cookie.match(/(?:^|;\s*)bigenda-session=([^;]+)/)
  if (match) return decodeURIComponent(match[1])

  const id = crypto.randomUUID()
  document.cookie = `bigenda-session=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}`
  return id
}

function sendBeaconPayload(type: string, metadata: Record<string, unknown>) {
  const sessionId = getSessionId()
  const payload = JSON.stringify({ type, metadata: { ...metadata, sessionId } })

  if (navigator.sendBeacon) {
    navigator.sendBeacon(API_ROUTE, payload)
  } else {
    fetch(API_ROUTE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }
}

export function useTrackEvent(type: string, metadata: Record<string, unknown> = {}) {
  const metadataRef = metadata

  return useCallback(() => {
    sendBeaconPayload(type, metadataRef)
  }, [type])
}

export function usePageView() {
  const pathname = usePathname()

  useEffect(() => {
    sendBeaconPayload('page_view', { path: pathname })
  }, [pathname])
}
