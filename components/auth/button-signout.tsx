'use client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { signOutAction } from '@/actions/auth.action'
import { Button } from '@/components/ui/button'

export default function ButtonSignOut() {
  const router = useRouter()
  const handleSignOut = async () => {
    await signOutAction()
    router.refresh()
  }
  return (
    <Button
      className='h-auto w-full justify-start bg-transparent p-2 px-2 font-normal text-destructive hover:bg-destructive/15 focus-visible:ring-0 focus-visible:ring-offset-0'
      onClick={handleSignOut}
    >
      <LogOut size={17} />
      <span>Sign out</span>
    </Button>
  )
}
