import { createClient } from '@sanity/client'
import { cache } from 'react'

function createSanityClient() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  }
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  })
}

export const getProcesses = cache(
  async (locale: string, category?: string) => {
    const client = createSanityClient()
    const query = category
      ? `*[_type == "process" && status == "published" && category == $category] | order(_createdAt desc)`
      : `*[_type == "process" && status == "published"] | order(_createdAt desc)`
    
    const params = category ? { category } : {}
    
    return client.fetch(query, params)
  }
)

export const getProcessBySlug = cache(
  async (slug: string, locale: string) => {
    const client = createSanityClient()
    return client.fetch(
      `*[_type == "process" && slug.current == $slug && status == "published"][0]`,
      { slug }
    )
  }
)

export const getGuides = cache(
  async (locale: string, category?: string) => {
    const client = createSanityClient()
    const query = category
      ? `*[_type == "guide" && status == "published" && category == $category] | order(_createdAt desc)`
      : `*[_type == "guide" && status == "published"] | order(_createdAt desc)`
    
    const params = category ? { category } : {}
    
    return client.fetch(query, params)
  }
)

export const getGuideBySlug = cache(
  async (slug: string, locale: string) => {
    const client = createSanityClient()
    return client.fetch(
      `*[_type == "guide" && slug.current == $slug && status == "published"][0]`,
      { slug }
    )
  }
)

export const getAlerts = cache(async () => {
  const client = createSanityClient()
  return client.fetch(
    `*[_type == "alert" && expiresAt > now()] | order(severity desc, _createdAt desc)`
  )
})
