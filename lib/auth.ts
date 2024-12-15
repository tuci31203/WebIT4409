import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { io as ClientIO } from 'socket.io-client'

import authConfig from '@/config/auth.config'
import db from '@/lib/db'
import { toTitleCase } from '@/lib/utils'
import { getTwoFactorConfirmationByUserId } from '@/service/two-factor.service'
import { findUserById } from '@/service/user.service'

const adapter = PrismaAdapter(db)

const socket = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
  path: '/api/socket/io',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  addTrailingSlash: false
})

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
    },
    async signOut(event) {
      if ('token' in event && event.token?.sub) {
        await db.user.update({
          where: { id: event.token.sub },
          data: { isOnline: false }
        })
        socket.emit('userOffline', event.token.sub)
      }
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
      try {
        await db.user.update({
          where: { id: user.id },
          data: { isOnline: true }
        })
        socket.emit('onlineStatus', {
          userId: user.id,
          status: true
        })
      } catch (error) {
        console.error('Error updating user online status:', error)
        return false
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.name = token.name
        session.user.image = token.image as string
        session.user.isOAuth = token.isOAuth as boolean
        session.user.provider = toTitleCase(token?.provider as string)
      }
      return session
    },
    async jwt({ token, account }) {
      if (!token.sub) return token

      const existingUser = await findUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await db.account.findFirst({
        where: { userId: existingUser.id }
      })

      if (account?.provider) {
        token.provider = account.provider
      }

      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.name = existingUser.name
      token.image = existingUser.image
      token.isOAuth = !!existingAccount

      return token
    }
  },
  ...authConfig
})
