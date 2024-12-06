import { User } from '@prisma/client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import db from '@/lib/db'

import ConversationHeader from './conversation-header'
import { ConversationSearch } from './conversation-search'
import ConversationSection from './conversation-section'

const ConversationSidebar = async ({ profile }: { profile: User }) => {
  const conversations = await db.conversation1.findMany({
    where: {
      OR: [{ profileOneId: profile.id }, { profileTwoId: profile.id }]
    },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      profileOne: true,
      profileTwo: true
    }
  })

  const peopleChattedWith = conversations.map(conversation => {
    if (conversation.profileOneId === profile.id) return conversation.profileTwo
    return conversation.profileOne
  })

  return (
    <div className='dark:sidebar-pattern-dark sidebar-pattern flex h-full w-full flex-col bg-[#f2f3f5] text-primary dark:bg-[#2b2d31]'>
      <ConversationHeader />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ConversationSearch profile={profile} peopleChattedWith={peopleChattedWith} />
        </div>
        <Separator className='my-2 rounded-md bg-zinc-200 dark:bg-zinc-700' />
        <ConversationSection profile={profile} />
      </ScrollArea>
    </div>
  )
}

export default ConversationSidebar
