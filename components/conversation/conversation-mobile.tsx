import { User } from '@prisma/client'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Menu } from 'lucide-react'

import { NavigationSidebar } from '@/components/navigation/navigation-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import ConversationSidebar from './conversation-sidebar'

export const ConversationMobileToggle = ({ profile }: { profile: User }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='flex gap-0 p-0'>
        <VisuallyHidden.Root>
          <SheetTitle></SheetTitle>
        </VisuallyHidden.Root>
        <div className='w-[72px]'>
          <NavigationSidebar />
        </div>

        <ConversationSidebar profile={profile} />
      </SheetContent>
    </Sheet>
  )
}
