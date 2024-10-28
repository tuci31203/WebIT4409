import FormSignUp from '@/components/auth/form-signup'

export default function Page() {
  return (
    <>
      <div className='space-y-1 pb-4 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Create your account</h1>
        <p className='text-sm text-muted-foreground'>Welcome! Please fill in the details to get started.</p>
      </div>
      <FormSignUp />
    </>
  )
}
