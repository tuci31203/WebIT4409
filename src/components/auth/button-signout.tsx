'use client'
import { signOutAction } from '@/actions/auth.action'
import { Button } from '@/components/ui/button'

export default function ButtonSignOut() {
  const handleSignOut = async () => {
    await signOutAction()
    window.location.href = '/'
  }
  return <Button onClick={handleSignOut}>Sign Out</Button>
}
