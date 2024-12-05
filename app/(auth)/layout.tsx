import { Card } from '@/components/ui/card'
import DotPattern from '@/components/ui/dot-pattern'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl'>
      <Card className='z-10 w-96 whitespace-pre-wrap'>{children}</Card>
      <DotPattern className='[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]' />
    </div>
  )
}
