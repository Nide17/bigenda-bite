import { createClient, type SanityClient } from '@sanity/client'
import { cache } from 'react'
import type { Process, Guide, Alert } from '@/types'

let sanityClient: SanityClient | null = null

function getSanityClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

  if (!projectId) {
    console.error('Sanity client not initialized: NEXT_PUBLIC_SANITY_PROJECT_ID is missing')
    return null
  }

  if (!sanityClient) {
    sanityClient = createClient({
      projectId,
      dataset,
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
    officialSource,
    category,
    city,
    translations,
    summary,
    status,
    tags,
    lastVerifiedDate,
    nextReviewDate
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
    summary,
    status,
    tags,
    lastReviewedDate,
    lastVerifiedDate,
    nextReviewDate
  }`

const ALERT_LIST_PROJECTION = `{
    _id,
    _type,
    _createdAt,
    type,
    severity,
    sourceName,
    sourceUrl,
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
    try {
      const query = category
        ? `*[_type == "process" && status == "published" && category == $category] | order(_createdAt desc)[0...100]`
        : `*[_type == "process" && status == "published"] | order(_createdAt desc)[0...100]`
      const params = category ? { category } : {}
      const result = await client.fetch<Process[]>(`*{${PROCESS_LIST_PROJECTION}}{${query}}`, params)
      if (process.env.NODE_ENV === 'production') {
        console.log(`Sanity fetch: ${result.length} processes returned`)
      }
      return result
    } catch (error) {
      console.error('Sanity getProcesses error:', error)
      return []
    }
  }
)

export const getProcessBySlug = cache(
  async (slug: string): Promise<Process | null> => {
    const client = getSanityClient()
    if (!client) return null
    try {
      return await client.fetch<Process | null>(
        `*[_type == "process" && (slug.current == $slug || _id == $slug) && status == "published"][0]{${PROCESS_LIST_PROJECTION}}`,
        { slug }
      )
    } catch (error) {
      console.error('Sanity getProcessBySlug error:', error)
      return null
    }
  }
)

export const getGuides = cache(
  async (locale: string, category?: string): Promise<Guide[]> => {
    const client = getSanityClient()
    if (!client) return []
    try {
      const query = category
        ? `*[_type == "guide" && status == "published" && category == $category] | order(_createdAt desc)[0...100]`
        : `*[_type == "guide" && status == "published"] | order(_createdAt desc)[0...100]`
      const params = category ? { category } : {}
      const result = await client.fetch<Guide[]>(`*{${GUIDE_LIST_PROJECTION}}{${query}}`, params)
      if (process.env.NODE_ENV === 'production') {
        console.log(`Sanity fetch: ${result.length} guides returned`)
      }
      return result
    } catch (error) {
      console.error('Sanity getGuides error:', error)
      return []
    }
  }
)

export const getGuideBySlug = cache(
  async (slug: string): Promise<Guide | null> => {
    const client = getSanityClient()
    if (!client) return null
    try {
      return await client.fetch<Guide | null>(
        `*[_type == "guide" && (slug.current == $slug || _id == $slug) && status == "published"][0]{${GUIDE_LIST_PROJECTION}}`,
        { slug }
      )
    } catch (error) {
      console.error('Sanity getGuideBySlug error:', error)
      return null
    }
  }
)

export const getAlerts = cache(async (): Promise<Alert[]> => {
  const client = getSanityClient()
  if (!client) return []
  try {
    const result = await client.fetch<Alert[]>(
      `*[_type == "alert" && status == "published" && expiresAt > now()] | order(severity desc, _createdAt desc)[0...50]{${ALERT_LIST_PROJECTION}}`
    )
    if (process.env.NODE_ENV === 'production') {
      console.log(`Sanity fetch: ${result.length} alerts returned`)
    }
    return result
  } catch (error) {
    console.error('Sanity getAlerts error:', error)
    return []
  }
})

