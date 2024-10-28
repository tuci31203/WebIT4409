import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import GoogleIcon from '@/components/icons/google'
import { Button } from '@/components/ui/button'
import MiddleSeparator from '@/components/ui/middle-separator'

export default function OAuthButton({ desc, label, link }: { desc?: string; label?: string; link?: string }) {
  return (
    <>
      <MiddleSeparator label='Or continue with' />
      <div className='grid grid-cols-2 gap-3'>
        <Button variant='outline' className='w-full'>
          <GoogleIcon />
          Google
        </Button>
        <Button variant='outline' className='w-full'>
          <GitHubLogoIcon />
          GitHub
        </Button>
      </div>
      <div className='text-center text-sm text-muted-foreground'>
        <span>{desc} </span>
        <Link href={link || ''} className='text-primary underline'>
          {label}
        </Link>
      </div>
    </>
  )
}
