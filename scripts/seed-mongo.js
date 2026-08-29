import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
async function main() {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db('bigenda-bite')

  await db.collection('users').insertMany([
    { name: 'Parmenide', email: 'parmenide@example.com', password: 'hashed', role: 'editor', displayName: 'Parmenide Editor' },
    { name: 'Contributor', email: 'contributor@example.com', password: 'hashed', role: 'contributor', displayName: 'Jane Contributor' },
  ])

  await db.collection('businesses').insertMany([
    { name: 'Kigali Coffee House', category: 'cafe', city: 'Kigali', location: { type: 'Point', coordinates: [30.0588, -1.9441] }, status: 'approved' },
    { name: 'Musanze Tours', category: 'tourism', city: 'Musanze', location: { type: 'Point', coordinates: [29.6349, -1.4986] }, status: 'approved' },
  ])

  await db.collection('contributions').insertMany([
    { guideId: 'how-to-book-a-flight-to-rwanda', text: 'Book early for better prices', city: 'Kigali', authorId: '1', status: 'published', upvotes: 0, flags: 0, promoted: false, submittedAt: new Date() },
    { guideId: 'how-to-buy-a-land-plot-in-rwanda', text: 'Use a licensed surveyor', city: 'Musanze', authorId: '2', status: 'pending', upvotes: 0, flags: 0, promoted: false, submittedAt: new Date() },
  ])

  await db.collection('leads').insertMany([
    { name: 'Alice', email: 'alice@example.com', company: 'TravelCo', message: 'Interested in partnership', source: 'website', status: 'new' },
  ])

  await db.collection('memberships').insertMany([
    { userId: '1', plan: 'business_owner', status: 'active', startedAt: new Date() },
  ])

  await db.collection('payments').insertMany([
    { userId: '1', amount: 5000, currency: 'RWF', status: 'succeeded', provider: 'momo', createdAt: new Date() },
  ])

  await db.collection('pendingUpdates').insertMany([
    { collection: 'businesses', documentId: '1', update: { name: 'Kigali Coffee House Updated' }, status: 'pending' },
  ])

  await db.collection('ads').insertMany([
    { title: 'Kigali Coffee Festival', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=192&fit=crop', linkUrl: 'https://example.com/coffee-festival', placement: 'sidebar', city: 'Kigali', active: true, impressions: 0, clicks: 0, startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { title: 'Musanze Gorilla Trekking', imageUrl: 'https://images.unsplash.com/photo-1516026671112-bd2ccdbb9a28?w=600&h=192&fit=crop', linkUrl: 'https://example.com/gorilla-trekking', placement: 'sidebar', city: 'Musanze', active: true, impressions: 0, clicks: 0, startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { title: 'Bigenda Bite Pro', imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=192&fit=crop', linkUrl: '/en/membership/checkout?plan=pro', placement: 'top', active: true, impressions: 0, clicks: 0, startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { title: 'Rubavu Beach Getaway', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=192&fit=crop', linkUrl: 'https://example.com/rubavu-beach', placement: 'inline', city: 'Rubavu', active: true, impressions: 0, clicks: 0, startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  ])

  console.log('MongoDB seed complete')
  await client.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})