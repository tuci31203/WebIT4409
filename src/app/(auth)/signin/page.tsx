import FormSignIn from '@/components/auth/form-signin'

export default function Page() {
  return (
    <>
      <div className='space-y-1 pb-4 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Sign in to DisCode</h1>
        <p className='text-sm text-muted-foreground'>Welcome back! Please sign into continue</p>
      </div>
      <FormSignIn />
    </>
  )
}
