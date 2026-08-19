import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db/mongodb'
import type { User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

const mongoClient = new MongoClient(process.env.MONGODB_URI!)
mongoClient.connect().catch((err) => console.error('MongoDB adapter connection error:', err))

interface CustomUser extends User {
  id: string
  role: string
  displayName: string
}

interface CustomJWT extends JWT {
  role?: string
  displayName?: string
}

interface ExtendedSession {
  user?: CustomUser
}

export const authOptions = {
  adapter: MongoDBAdapter(mongoClient),
  providers: [
    {
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
    async jwt({ token, user }: { token: CustomJWT; user?: CustomUser }) {
      if (user) {
        token.role = user.role
        token.displayName = user.displayName
      }
      return token
    },
    async session({ session, token }: { session: ExtendedSession; token: CustomJWT }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.displayName = token.displayName as string
      }
      return session
    },
  },
  pages: {
    signIn: '/en/login',
  },
  session: { strategy: 'database' },
  debug: true,
}