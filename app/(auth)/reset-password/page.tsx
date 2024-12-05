import FormResetPassword from '@/components/auth/form-reset-password'
import Logo from '@/components/icons/logo'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  return (
    <>
      <CardHeader className='text-center'>
        <Logo className='flex justify-center pb-4' />
        <CardTitle>Change your password</CardTitle>
        <CardDescription>Enter a new password below to change your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormResetPassword />
      </CardContent>
    </>
  )
}
