import { createClient, type SanityClient } from '@sanity/client'
import { cache } from 'react'
import type { Process, Guide, Alert } from '@/types'

let sanityClient: SanityClient | null = null

function getSanityClient(): SanityClient | null {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return null
  }

  if (!sanityClient) {
    sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      useCdn: true,
    })
  }

  return sanityClient
}

const PROCESS_LIST_PROJECTION = `{
    _id,
    _type,
    _createdAt,
    slug,
    sourceType,
    category,
    city,
    translations,
    status,
    tags,
    lastVerifiedDate
  }`

const GUIDE_LIST_PROJECTION = `{
    _id,
    _type,
    _createdAt,
    slug,
    sourceType,
    category,
    city,
    translations,
    status,
    tags,
    lastReviewedDate,
    lastVerifiedDate,
    aiDraftStatus
  }`

const ALERT_LIST_PROJECTION = `{
    _id,
    _type,
    _createdAt,
    type,
    severity,
    city,
    relatedProcessId,
    translations,
    expiresAt,
    status
  }`

export const getProcesses = cache(
  async (locale: string, category?: string): Promise<Process[]> => {
    const client = getSanityClient()
    if (!client) return []
    const query = category
      ? `*[_type == "process" && status == "published" && category == $category] | order(_createdAt desc)[0...100]`
      : `*[_type == "process" && status == "published"] | order(_createdAt desc)[0...100]`
    const params = category ? { category } : {}
    return client.fetch<Process[]>(`*{${PROCESS_LIST_PROJECTION}}{${query}}`, params)
  }
)

export const getProcessBySlug = cache(
  async (slug: string): Promise<Process | null> => {
    const client = getSanityClient()
    if (!client) return null
    return client.fetch<Process | null>(
      `*[_type == "process" && (slug.current == $slug || _id == $slug) && status == "published"][0]{${PROCESS_LIST_PROJECTION}}`,
      { slug }
    )
  }
)

export const getGuides = cache(
  async (locale: string, category?: string): Promise<Guide[]> => {
    const client = getSanityClient()
    if (!client) return []
    const query = category
      ? `*[_type == "guide" && status == "published" && category == $category] | order(_createdAt desc)[0...100]`
      : `*[_type == "guide" && status == "published"] | order(_createdAt desc)[0...100]`
    const params = category ? { category } : {}
    return client.fetch<Guide[]>(`*{${GUIDE_LIST_PROJECTION}}{${query}}`, params)
  }
)

export const getGuideBySlug = cache(
  async (slug: string): Promise<Guide | null> => {
    const client = getSanityClient()
    if (!client) return null
    return client.fetch<Guide | null>(
      `*[_type == "guide" && (slug.current == $slug || _id == $slug) && status == "published"][0]{${GUIDE_LIST_PROJECTION}}`,
      { slug }
    )
  }
)

export const getAlerts = cache(async (): Promise<Alert[]> => {
  const client = getSanityClient()
  if (!client) return []
  return client.fetch<Alert[]>(
    `*[_type == "alert" && status == "published" && expiresAt > now()] | order(severity desc, _createdAt desc)[0...50]{${ALERT_LIST_PROJECTION}}`
  )
})

