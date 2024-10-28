import Logo from '@/components/icons/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div
          className='absolute inset-0 bg-cover bg-center object-cover'
          style={{
            backgroundImage: 'url(/images/background-auth.jpg)'
          }}
        />
        <Logo className='relative z-20 text-xl' />
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>&ldquo;Connect, communicate, and share all in one place, wherever you are!&rdquo;</p>
            <footer className='text-sm text-muted-foreground'>DisCode development team</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2'>
            <Logo className='mb-2 justify-center text-2xl' />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
