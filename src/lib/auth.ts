import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import authConfig from '@/config/auth.config'
import prisma from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin'
  },
  ...authConfig
})
