import { redirect } from 'next/navigation'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import UserButton from '@/components/user-button'
import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

import { ModeToggle } from '../mode-toggle'
import { NavigationAction } from './navigation-action'
import { NavigationItem } from './navigation-item'

export const NavigationSidebar = async () => {
  const user = await currentProfile()
  if (!user) {
    return redirect('/')
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          userId: user.id
        }
      }
    }
  })

  return (
    <div className='flex h-full w-full flex-col items-center space-y-4 bg-[#e3e5e8] py-3 text-primary dark:bg-[#1e1f22]'>
      <NavigationAction />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ScrollArea className='w-full flex-1'>
        {servers.map(server => (
          <div key={server.id} className='mb-4'>
            <NavigationItem id={server.id} name={server.name} image={server.image} />
          </div>
        ))}
      </ScrollArea>
      <div className='mt-auto flex flex-col items-center gap-y-4 pb-3'>
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  )
}
