import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set. Skipping index creation.')
  process.exit(0)
}

const client = new MongoClient(MONGODB_URI)

async function createIndexes() {
  try {
    await client.connect()
    const db = client.db('bigenda-bite')

    console.log('Creating MongoDB indexes...')

    const users = db.collection('users')
    await users.createIndex({ email: 1 }, { unique: true })
    await users.createIndex({ role: 1 })
    console.log('✓ users indexes')

    const businesses = db.collection('businesses')
    await businesses.createIndex({ city: 1, status: 1, name: 1 })
    await businesses.createIndex({ slug: 1 }, { unique: true })
    await businesses.createIndex({ location: '2dsphere' })
    console.log('✓ businesses indexes')

    const ads = db.collection('ads')
    await ads.createIndex({ active: 1, placement: 1, startDate: 1, endDate: 1 })
    await ads.createIndex({ city: 1 })
    console.log('✓ ads indexes')

    const notifications = db.collection('notifications')
    await notifications.createIndex({ userId: 1, read: 1, createdAt: -1 })
    console.log('✓ notifications indexes')

    const userSubmissions = db.collection('userSubmissions')
    await userSubmissions.createIndex({ contentType: 1, contentId: 1, status: 1, createdAt: -1 })
    await userSubmissions.createIndex({ userId: 1, createdAt: -1 })
    console.log('✓ userSubmissions indexes')

    const contributions = db.collection('contributions')
    await contributions.createIndex({ guideId: 1, status: 1, submittedAt: -1 })
    console.log('✓ contributions indexes')

    const pendingUpdates = db.collection('pendingUpdates')
    await pendingUpdates.createIndex({ status: 1, detectedAt: -1 })
    console.log('✓ pendingUpdates indexes')

    const events = db.collection('events')
    await events.createIndex({ type: 1, createdAt: -1 })
    console.log('✓ events indexes')

    const payments = db.collection('payments')
    await payments.createIndex({ transactionId: 1 }, { unique: true })
    console.log('✓ payments indexes')

    const emailVerifications = db.collection('emailVerifications')
    await emailVerifications.createIndex({ email: 1, used: 1, expiresAt: 1 })
    console.log('✓ emailVerifications indexes')

    const passwordResets = db.collection('passwordResets')
    await passwordResets.createIndex({ token: 1, used: 1, expiresAt: 1 })
    console.log('✓ passwordResets indexes')

    console.log('All indexes created successfully.')
  } catch (error) {
    console.error('Error creating indexes:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

createIndexes()
