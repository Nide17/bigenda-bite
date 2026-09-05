import { MongoClient, Db, FindOptions, UpdateOptions, InsertOneOptions, SortDirection } from 'mongodb'

type MockCursor<T> = {
  toArray: () => Promise<T[]>
  sort: (sort: Record<string, SortDirection | { $meta: string }>) => MockCursor<T>
  limit: (limit: number) => MockCursor<T>
}

type MockCollection<T> = {
  find: (filter?: Record<string, unknown>, options?: FindOptions) => MockCursor<T>
  updateOne: (filter: Record<string, unknown>, update: Record<string, unknown>, options?: UpdateOptions) => Promise<{ acknowledged: boolean }>
  insertOne: (doc: T, options?: InsertOneOptions) => Promise<{ acknowledged: boolean; insertedId: string }>
  countDocuments: (filter?: Record<string, unknown>) => Promise<number>
}

type MockDb = {
  collection: () => MockCollection<unknown>
}

function createMockCollection<T>(): MockCollection<T> {
  const empty: T[] = []
  const cursor: MockCursor<T> = {
    toArray: async () => empty,
    sort: () => cursor,
    limit: () => cursor,
  }
  return {
    find: () => cursor,
    updateOne: async () => ({ acknowledged: true }),
    insertOne: async () => ({ acknowledged: true, insertedId: 'mock' }),
    countDocuments: async () => 0,
  }
}

function createMockDb(): MockDb {
  return {
    collection: () => createMockCollection<unknown>(),
  }
}

let client: MongoClient | null = null

async function getClient(): Promise<MongoClient | null> {
  if (!process.env.MONGODB_URI) {
    return null
  }

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    await client.connect()
  }

  return client
}

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    return createMockDb() as unknown as Db
  }

  const mongoClient = await getClient()
  if (!mongoClient) {
    return createMockDb() as unknown as Db
  }

  const db = mongoClient.db('bigenda-bite')
  try {
    await db.collection('businesses').createIndex({ location: '2dsphere' })
  } catch {
    // index may already exist
  }
  return db
}
