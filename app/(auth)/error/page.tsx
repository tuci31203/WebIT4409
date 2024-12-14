import Link from 'next/link'

import Logo from '@/components/icons/logo'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className='flex w-full flex-col items-center space-y-6 py-6 text-center'>
      <Logo />

      <h1 className='font-bold'>Sorry, we could&apos;t find this page</h1>
      <div className='gap-x-2 rounded-md bg-destructive/15 p-3 text-destructive'>
        <span className='text-xs'>Error occurred during the authentication process</span>
      </div>
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
