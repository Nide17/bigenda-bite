import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db/mongodb'
import GoogleProvider from 'next-auth/providers/google'
import type { User } from 'next-auth'
import type { AuthOptions } from 'next-auth'

function validateEnv() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Auth: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set')
  }
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('Auth: NEXTAUTH_SECRET is not set. Google auth will fail in production.')
  }
  if (!process.env.NEXTAUTH_URL) {
    console.error('Auth: NEXTAUTH_URL is not set. Set it to your production URL, e.g. https://bigenda-bite.vercel.app')
  }
}

validateEnv()

async function createMongoClient(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set')
  }
  
  const maxRetries = 3
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      await client.connect()
      console.log(`✅ MongoDB connected on attempt ${attempt}`)
      return client
    } catch (error) {
      lastError = error as Error
      console.error(`MongoDB connection attempt ${attempt}/${maxRetries} failed:`, lastError.message)
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError || new Error('Failed to connect to MongoDB after retries')
}

interface CustomUser extends User {
  id: string
  role: string
  displayName: string
  isForeigner: boolean
}

export interface AppSession {
  user?: {
    id: string
    email: string
    displayName: string
    role: string
    isForeigner: boolean
  }
  expires: string
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(createMongoClient),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    {
      type: 'credentials' as const,
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: unknown) {
        try {
          const db = await connectToDatabase()
          const users = db.collection('users')
          const user = await users.findOne({ email: (credentials as Record<string, unknown>)?.email })

          if (!user) {
            console.error('Auth: user not found for email', (credentials as Record<string, unknown>)?.email)
            return null
          }

          const passwordMatch = await bcrypt.compare(
            String((credentials as Record<string, unknown>)?.password || ''),
            user.password
          )

          if (!passwordMatch) {
            console.error('Auth: password mismatch for email', (credentials as Record<string, unknown>)?.email)
            return null
          }

          console.error('Auth: login success for email', (credentials as Record<string, unknown>)?.email, 'role', user.role)

          return {
            id: user._id.toString(),
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            isForeigner: user.isForeigner || false,
          }
        } catch (error) {
          console.error('Auth authorize error:', error)
          return null
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser
        token.sub = customUser.id
        token.role = customUser.role
        token.displayName = customUser.displayName
        token.isForeigner = customUser.isForeigner
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        const customUser = session.user as unknown as CustomUser
        customUser.id = (token.sub as string) || customUser.id || session.user.email || ''
        customUser.role = (token.role as string) || customUser.role
        customUser.displayName = (token.displayName as string) || customUser.displayName
        customUser.isForeigner = (token.isForeigner as boolean) ?? customUser.isForeigner
      }
      return session
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.email) {
        try {
          const db = await connectToDatabase()
          await db.collection('users').updateOne(
            { email: user.email },
            {
              $setOnInsert: {
                role: 'reader',
                displayName: user.name || user.email || 'Google User',
                emailVerified: true,
                emailVerifiedAt: new Date(),
                isForeigner: false,
              },
            },
            { upsert: true }
          )
        } catch (error) {
          console.error('Auth signIn event error:', error)
        }
      }
    },
  },
  pages: {
    signIn: '/en/login',
  },
  session: { strategy: 'database' as const },
  debug: false,
}
