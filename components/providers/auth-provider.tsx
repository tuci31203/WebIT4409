'use client'

import { usePathname } from 'next/navigation'
import type { Session } from 'next-auth'
import { getCsrfToken } from 'next-auth/react'
import React, { Context, createContext, type PropsWithChildren, useEffect, useMemo, useState } from 'react'

type TSessionProviderProps = PropsWithChildren<{
  session?: Session | null
}>

type TUpdateSession = (data?: any) => Promise<Session | null | undefined>
export type TSessionContextValue = { data: Session | null; status: string; update: TUpdateSession }

export const SessionContext: Context<TSessionContextValue | undefined> = createContext?.<
  TSessionContextValue | undefined
>(undefined)

export default function AuthProvider({ session: initialSession = null, children }: TSessionProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [loading, setLoading] = useState<boolean>(!initialSession)
  const pathname = usePathname()

  useEffect(() => {
    const fetchSession = async () => {
      if (!initialSession) {
        const fetchedSessionResponse: Response = await fetch('/api/auth/session')
        const fetchedSession: Session | null = await fetchedSessionResponse.json()

        setSession(fetchedSession)
        setLoading(false)
      }
    }

    fetchSession().finally()
  }, [initialSession, pathname])

  const sessionData = useMemo(
    () => ({
      data: session,
      status: loading ? 'loading' : session ? 'authenticated' : 'unauthenticated',
      async update(data?: any) {
        if (loading || !session) return

        setLoading(true)

        const fetchOptions: RequestInit = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        if (data) {
          fetchOptions.method = 'POST'
          fetchOptions.body = JSON.stringify({ csrfToken: await getCsrfToken(), data })
        }

        const fetchedSessionResponse: Response = await fetch('/api/auth/session', fetchOptions)
        let fetchedSession: Session | null = null

        if (fetchedSessionResponse.ok) {
          fetchedSession = await fetchedSessionResponse.json()

          setSession(fetchedSession)
          setLoading(false)
        }

        return fetchedSession
      }
    }),
    [loading, session]
  )

  return <SessionContext.Provider value={sessionData}>{children}</SessionContext.Provider>
}
