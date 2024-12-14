'use client'
import { CircleCheck, CircleX } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { verifyEmailAction } from '@/actions/auth.action'
import Logo from '@/components/icons/logo'
import { Button } from '@/components/ui/button'
import { cn, getQueryParams } from '@/lib/utils'

export default function Page() {
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const token = getQueryParams('token')

  const onSubmit = useCallback(async () => {
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const res = await verifyEmailAction(token)
      setStatus(res.success)
      setMessage(res.message)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    onSubmit().then(r => r)
  }, [onSubmit])

  return (
    <div className='flex w-full flex-col items-center space-y-6 py-6 text-center'>
      <Logo />
      <h1 className='font-bold'>Verification Page</h1>
      {isLoading && <p className='text-gray-500'>Loading...</p>}

      {!isLoading && !status && <CircleX size={35} className='rounded-full bg-destructive/15 text-destructive' />}
      {!isLoading && status && <CircleCheck size={35} className='rounded-full bg-emerald-500/15 text-emerald-500' />}

      <p className={cn(status ? 'text-emerald-500' : 'text-destructive', 'font-bold')}>{message}</p>
      <div className='flex w-full items-center justify-center gap-x-3 sm:w-auto'>
        <Link href='/signin'>
          <Button variant='outline'>Back to sign in</Button>
        </Link>
        <Link href='/'>
          <Button>Take me home</Button>
        </Link>
      </div>
    </div>
  )
}
