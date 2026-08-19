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
  async (slug: string, locale: string): Promise<Process | null> => {
    const client = createSanityClient()
    if (!client) return null
    const result = await client.fetch<Process | null>(
      `*[_type == "process" && slug.current == $slug && status == "published"][0]`,
      { slug }
    )
    if (result) return result
    const byId = await client.fetch<Process | null>(
      `*[_type == "process" && _id == $slug && status == "published"][0]`,
      { slug }
    )
    if (byId) return byId
    return client.fetch<Process | null>(
      `*[_type == "process" && translations.${locale}.title match $title && status == "published"][0]`,
      { title: `*${slug.replace(/-/g, ' ')}*` }
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
  async (slug: string, locale: string): Promise<Guide | null> => {
    const client = createSanityClient()
    if (!client) return null
    const result = await client.fetch<Guide | null>(
      `*[_type == "guide" && slug.current == $slug && status == "published"][0]`,
      { slug }
    )
    if (result) return result
    const byId = await client.fetch<Guide | null>(
      `*[_type == "guide" && _id == $slug && status == "published"][0]`,
      { slug }
    )
    if (byId) return byId
    return client.fetch<Guide | null>(
      `*[_type == "guide" && translations.${locale}.title match $title && status == "published"][0]`,
      { title: `*${slug.replace(/-/g, ' ')}*` }
    )
  }
)

export const getAlerts = cache(async (): Promise<Alert[]> => {
  const client = createSanityClient()
  if (!client) return []
  return client.fetch(
    `*[_type == "alert" && expiresAt > now()] | order(severity desc, _createdAt desc)`
  ) as Promise<Alert[]>
})

