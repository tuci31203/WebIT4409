import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import authConfig from '@/config/auth.config'
import db from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/service/two-factor.service'
import { findUserById } from '@/service/user.service'

const adapter = PrismaAdapter(db)

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  adapter,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin',
    error: '/error'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true

      const existingUser = await findUserById(user.id)
      if (!existingUser?.emailVerified) return false

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirm = await getTwoFactorConfirmationByUserId(existingUser.id)

        if (!twoFactorConfirm) return false

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirm.id }
        })
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }
      return session
    },
    async jwt({ token, session, trigger }) {
      if (!token.sub) return token

      const existingUser = await findUserById(token.sub)

      if (!existingUser) return token

      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      if (trigger === 'update' && session) {
        const updateData: Record<string, unknown> = {}

        if (session.name) {
          token.name = session.name
          updateData.name = session.name
        }

        if (session.isTwoFactorEnabled !== undefined) {
          token.isTwoFactorEnabled = session.isTwoFactorEnabled
          updateData.isTwoFactorEnabled = session.isTwoFactorEnabled as boolean
        }

        if (Object.keys(updateData).length > 0) {
          await db.user.update({
            where: { id: token.sub },
            data: updateData
          })
        }
      }

      return token
    }
  },
  ...authConfig
})
