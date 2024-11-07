import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import authConfig from '@/config/auth.config'
import prisma from '@/lib/prisma'

const adapter = PrismaAdapter(prisma)

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin',
    error: '/error'
  },
  events: {
    async linkAccount({ user, account }) {
      console.log('linkAccount', account)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  callbacks: {
    // async signIn({ user, account, profile }) {
    //   const existingUser = await findUserById(user.id)
    //   if (!existingUser?.emailVerified) return false
    //
    //   return true
    // },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      return token
    }
  },
  ...authConfig
})
