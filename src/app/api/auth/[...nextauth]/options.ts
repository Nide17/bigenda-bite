import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const mongoClient = new MongoClient(process.env.MONGODB_URI!)

export const authOptions = {
  adapter: MongoDBAdapter(mongoClient),
  providers: [
    {
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        const db = mongoClient.db('bigenda-bite')
        const users = db.collection('users')
        const user = await users.findOne({ email: credentials?.email })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials?.password || '',
          user.password
        )

        if (!passwordMatch) return null

        return {
          id: user._id.toString(),
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.displayName = user.displayName
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        ;(session.user as any).id = token.sub
        ;(session.user as any).role = token.role as string
        ;(session.user as any).displayName = token.displayName as string
      }
      return session
    },
  },
  pages: {
    signIn: '/[lang]/login',
  },
  session: { strategy: 'database' },
} as any