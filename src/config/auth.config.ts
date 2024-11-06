import Credentials from '@auth/core/providers/credentials'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import type { NextAuthConfig } from 'next-auth'

import envConfig from '@/config/env.config'

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
    Credentials({})
  ]
} satisfies NextAuthConfig
