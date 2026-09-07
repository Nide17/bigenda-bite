export function validateProductionConfig() {
  const required = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'SANITY_API_TOKEN',
    'NEXT_PUBLIC_BASE_URL',
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    const isTest = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT === '1'
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-production-server'
    const isDev = process.env.NODE_ENV === 'development'
    if (!isTest && !isBuild && !isDev) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.log('Production mode: MongoDB URI is configured')
  }
}
