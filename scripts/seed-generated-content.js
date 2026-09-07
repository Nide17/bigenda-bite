import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = createClient({
  projectId: '55et5l4p',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function readGeneratedEntries() {
  const entriesPath = path.resolve(__dirname, '../docs/GENERATED_CONTENT_ENTRIES.json')
  const raw = readFileSync(entriesPath, 'utf8')
  return JSON.parse(raw)
}

async function existsByTitle(type: string, title: string) {
  const doc = await client.fetch(
    `*[_type == $type && translations.en.title == $title][0]`,
    { type, title }
  )
  return Boolean(doc)
}

async function main() {
  const entries = readGeneratedEntries()
  console.log(`Loaded ${entries.length} entries from docs/GENERATED_CONTENT_ENTRIES.json`)

  for (const entry of entries) {
    const type = entry._type
    const title = entry.translations?.en?.title

    if (!type || !title) {
      console.warn('Skipping entry without _type or translations.en.title')
      continue
    }

    try {
      if (await existsByTitle(type, title)) {
        console.log(`Skipping existing ${type}: ${title}`)
        continue
      }

      await client.create(entry)
      console.log(`Created ${type}: ${title}`)
    } catch (err) {
      console.error(`Failed ${type}: ${title}`, err.message)
    }
  }

  console.log('Done.')
}

main().catch(console.error)
