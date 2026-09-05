import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import type { AppSession } from '@/app/api/auth/[...nextauth]/options'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
}

async function createSessionClient() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }
  const client = new MongoClient(uri)
  await client.connect()
  return client
}

const sessionOptions = {
  ...authOptions,
  adapter: MongoDBAdapter(createSessionClient),
}

export async function getSession(): Promise<AppSession | null> {
  try {
    return await getServerSession(sessionOptions)
  } catch (error) {
    console.error('getSession failed:', error)
    return null
  }
}
