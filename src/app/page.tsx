import Link from 'next/link'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className='flex justify-between'>
      <ModeToggle />
      <div className='grid grid-cols-2 gap-4'>
        <Link href='/signin'>
          <Button>Sign In</Button>
        </Link>
        <Link href='/signup'>
          <Button>Sign Up</Button>
        </Link>
      </div>
    </div>
  )
}
