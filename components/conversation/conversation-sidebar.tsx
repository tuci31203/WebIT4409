import { User } from '@prisma/client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import ConversationHeader from './conversation-header'
import { ConversationSearch } from './conversation-search'
import ConversationSection from './conversation-section'

const ConversationSidebar = ({ profile }: { profile: User }) => {
  return (
    <div className='dark:sidebar-pattern-dark sidebar-pattern flex h-full w-full flex-col bg-[#f2f3f5] text-primary dark:bg-[#2b2d31]'>
      <ConversationHeader />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ConversationSearch profile={profile} />
        </div>
        <Separator className='my-2 rounded-md bg-zinc-200 dark:bg-zinc-700' />
        <ConversationSection profile={profile} />
      </ScrollArea>
    </div>
  )
}

export default ConversationSidebar
