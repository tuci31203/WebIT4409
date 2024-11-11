import FormSignUp from '@/components/auth/form-signup'
import Logo from '@/components/icons/logo'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  return (
    <>
      <CardHeader className='text-center'>
        <Logo className='flex justify-center pb-4' />
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormSignUp />
      </CardContent>
    </>
  )
}
