import { DefaultSession } from 'next-auth'

export type ExtendUser = DefaultSession['user'] & {
  isTwoFactorEnabled: boolean
  isOAuth: boolean
  provider: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendUser
  }
}

declare module 'next-auth/react' {
  function getCsrfToken(): Promise<string>
}
