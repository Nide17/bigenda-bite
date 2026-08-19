import { MongoClient, Db, FindOptions, UpdateOptions, InsertOneOptions, SortDirection } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

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

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    return createMockDb() as unknown as Db
  }

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    await client.db('bigenda-bite').collection('businesses').createIndex({ location: '2dsphere' })
  }

  db = client.db('bigenda-bite')
  return db
}

