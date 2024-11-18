import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(type !== 'password')
  const toggleVisibility = () => setIsVisible(prevState => !prevState)

  return (
    <div className='relative'>
      <input
        type={isVisible ? 'text' : type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
      {type === 'password' && (
        <button
          className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          type='button'
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          aria-controls='password'
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden='true' />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden='true' />
          )}
        </button>
      )}
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
