import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '55et5l4p',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function main() {
  console.log('Fetching all guides and alerts...')
  const guides = await client.fetch('*[_type == "guide" && status == "published"]')
  const alerts = await client.fetch('*[_type == "alert" && status == "published"]')

  const toDelete: string[] = []

  for (const doc of guides) {
    const title = doc.translations?.en?.title || ''
    const category = doc.category || ''

    if (title === 'hhhh' || title === 'guid 1' || category === 'undefined') {
      toDelete.push(doc._id)
      continue
    }
  }

  const seen = new Map<string, string>()
  for (const doc of guides) {
    const title = doc.translations?.en?.title || ''
    const key = `${doc._type}:${title}`
    if (seen.has(key)) {
      toDelete.push(doc._id)
    } else {
      seen.set(key, doc._id)
    }
  }

  for (const doc of alerts) {
    const text = typeof doc.translations?.en === 'string' ? doc.translations.en : ''
    const key = `alert:${text}`
    if (seen.has(key)) {
      toDelete.push(doc._id)
    } else {
      seen.set(key, doc._id)
    }
  }

  console.log(`Found ${toDelete.length} documents to delete`)

  for (const id of toDelete) {
    try {
      await client.delete(id)
      console.log(`Deleted: ${id}`)
    } catch (err) {
      console.error(`Failed to delete ${id}:`, err.message)
    }
  }

  console.log('Cleanup complete.')
}

main().catch(console.error)
