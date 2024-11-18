import { AudioLines } from 'lucide-react'

import { cn } from '@/lib/utils'

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn(className, 'flex items-center font-bold')}>
      <AudioLines className='mr-2 size-9 text-teal-800' />
      <div className='bg-gradient-to-br from-purple-500 via-red-600 to-yellow-600 bg-clip-text text-transparent'>
        DisCode
      </div>
    </div>
  )
}
