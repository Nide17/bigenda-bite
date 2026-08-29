import { createClient } from '@sanity/client'
import { cache } from 'react'
import type { Process, Guide, Alert } from '@/types'

function createSanityClient() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return null
  }
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  })
}

export const getProcesses = cache(
  async (locale: string, category?: string): Promise<Process[]> => {
    const client = createSanityClient()
    if (!client) return []
    const query = category
      ? `*[_type == "process" && status == "published" && category == $category] | order(_createdAt desc)`
      : `*[_type == "process" && status == "published"] | order(_createdAt desc)`
    const params = category ? { category } : {}
    return client.fetch(query, params) as Promise<Process[]>
  }
)

export const getProcessBySlug = cache(
  async (slug: string): Promise<Process | null> => {
    const client = createSanityClient()
    if (!client) return null
    return client.fetch<Process | null>(
      `*[_type == "process" && slug.current == $slug && status == "published"][0]`,
      { slug }
    )
  }
)

export const getGuides = cache(
  async (locale: string, category?: string): Promise<Guide[]> => {
    const client = createSanityClient()
    if (!client) return []
    const query = category
      ? `*[_type == "guide" && status == "published" && category == $category] | order(_createdAt desc)`
      : `*[_type == "guide" && status == "published"] | order(_createdAt desc)`
    const params = category ? { category } : {}
    return client.fetch(query, params) as Promise<Guide[]>
  }
)

export const getGuideBySlug = cache(
  async (slug: string): Promise<Guide | null> => {
    const client = createSanityClient()
    if (!client) return null
    return client.fetch<Guide | null>(
      `*[_type == "guide" && slug.current == $slug && status == "published"][0]`,
      { slug }
    )
  }
)

export const getAlerts = cache(async (): Promise<Alert[]> => {
  const client = createSanityClient()
  if (!client) return []
  return client.fetch(
    `*[_type == "alert" && status == "published" && expiresAt > now()] | order(severity desc, _createdAt desc)`
  ) as Promise<Alert[]>
})

