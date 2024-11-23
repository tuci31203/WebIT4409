import Link from 'next/link'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { currentProfile } from '@/lib/current-profile'

export default async function Home() {
  const user = await currentProfile()
  return (
    <div className='flex justify-between'>
      <ModeToggle />
      {!user && (
        <div className='grid grid-cols-2 gap-4'>
          <Link href='/signin'>
            <Button>Sign In</Button>
          </Link>
          <Link href='/signup'>
            <Button>Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
