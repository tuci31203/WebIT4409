'use client'

import type { Session } from 'next-auth'
import { useContext } from 'react'

import { SessionContext, TSessionContextValue } from '@/components/providers/auth-provider'

export default function useCurrentUser(): TSessionContextValue {
  if (!SessionContext) {
    throw new Error('React Context is unavailable in Server Components')
  }

  const sessionContent: TSessionContextValue = useContext(SessionContext) || {
    data: null,
    status: 'unauthenticated',
    async update(): Promise<Session | null | undefined> {
      return undefined
    }
  }

  if (!sessionContent && process.env.NODE_ENV !== 'production') {
    throw new Error('[auth-wrapper-error]: `useCurrentUser` must be wrapped in a <SessionDataProvider />')
  }

  return {
    data: sessionContent.data,
    status: sessionContent.status,
    update: sessionContent.update
  }
}
