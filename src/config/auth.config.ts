import { CallbackRouteError } from '@auth/core/errors'
import Credentials from '@auth/core/providers/credentials'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import type { NextAuthConfig } from 'next-auth'

import envConfig from '@/config/env.config'
import prisma from '@/lib/prisma'
import { SignInBody, SignInResponseType } from '@/schema/auth.schema'
import { comparePassword } from '@/utils/crypto'

export default {
  providers: [
    Google({
      clientId: envConfig.AUTH_GOOGLE_ID,
      clientSecret: envConfig.AUTH_GOOGLE_SECRET
    }),
    GitHub({
      clientId: envConfig.AUTH_GITHUB_ID,
      clientSecret: envConfig.AUTH_GITHUB_SECRET
    }),
    Credentials({
      authorize: async credentials => {
        const validatedField = SignInBody.safeParse(credentials)

        if (validatedField.success) {
          const { email, password } = validatedField.data

          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user) return null

          if (!user.password) {
            throw new CallbackRouteError()
          }

          const isPasswordValid = await comparePassword(password, user.password)

          if (isPasswordValid) {
            const { password: _, ...rest } = user
            return rest as SignInResponseType['data']
          }
        }

        return null
      }
    }) as any
  ]
} satisfies NextAuthConfig
