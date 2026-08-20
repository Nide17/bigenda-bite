import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db/mongodb'
import type { User } from 'next-auth'
import type { AuthOptions } from 'next-auth'

const mongoClient = new MongoClient(process.env.MONGODB_URI!)
mongoClient.connect().catch((err) => console.error('MongoDB adapter connection error:', err))

interface CustomUser extends User {
  id: string
  role: string
  displayName: string
}

export interface AppSession {
  user?: {
    id: string
    email: string
    displayName: string
    role: string
  }
  expires: string
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(mongoClient),
  providers: [
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
        token.role = customUser.role
        token.displayName = customUser.displayName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const customUser = session.user as unknown as CustomUser
        customUser.id = token.sub!
        customUser.role = token.role as string
        customUser.displayName = token.displayName as string
      }
      return session
    },
  },
  pages: {
    signIn: '/en/login',
  },
  session: { strategy: 'database' as const },
  debug: true,
}
