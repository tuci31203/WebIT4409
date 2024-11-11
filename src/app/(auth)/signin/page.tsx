import FormSignIn from '@/components/auth/form-signin'
import Logo from '@/components/icons/logo'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  return (
    <>
      <CardHeader className='text-center'>
        <Logo className='flex justify-center pb-4' />
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Welcome back! Please sign into continue</CardDescription>
      </CardHeader>
      <CardContent>
        <FormSignIn />
      </CardContent>
    </>
  )
}
