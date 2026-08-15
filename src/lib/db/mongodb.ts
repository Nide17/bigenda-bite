import { MongoClient } from 'mongodb'

let client: MongoClient | null = null

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add MONGODB_URI to .env.local')
  }

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    await client.db('bigenda-bite').collection('businesses').createIndex({ location: '2dsphere' })
  }

  return client.db('bigenda-bite')
}
