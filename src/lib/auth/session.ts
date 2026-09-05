/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import type { AppSession } from '@/app/api/auth/[...nextauth]/options'
import type { NextRequest } from 'next/server'
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

export async function getSession(request?: NextRequest): Promise<AppSession | null> {
  try {
    const session = request
      ? await (getServerSession as any)(request, undefined, sessionOptions)
      : await getServerSession(sessionOptions)
    return session as AppSession | null
  } catch (error) {
    console.error('getSession failed:', error)
    return null
  }
}
