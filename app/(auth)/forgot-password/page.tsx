import { MoveLeft } from 'lucide-react'
import Link from 'next/link'

import FormForgotPassword from '@/components/auth/form-forgot-password'
import Logo from '@/components/icons/logo'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  return (
    <>
      <CardHeader className='text-center'>
        <div className='relative flex items-center justify-center pb-4'>
          <Link href='/signin' className='absolute left-1.5'>
            <MoveLeft className='size-5 hover:size-6 hover:text-muted-foreground' />
          </Link>
          <Logo className='flex justify-center' />
        </div>
        <CardTitle>Forgot your password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormForgotPassword />
      </CardContent>
    </>
  )
}
