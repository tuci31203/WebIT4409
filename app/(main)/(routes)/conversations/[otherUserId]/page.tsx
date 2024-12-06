import { redirect } from 'next/navigation'

import { DmHeader } from '@/components/conversation/dm-header'
import { DmInput } from '@/components/conversation/dm-input'
import { DmMessages } from '@/components/conversation/dm-messages'
import { MediaRoom } from '@/components/media-room'
import { getOrCreateConversation } from '@/lib/conversation1'
import { currentProfile } from '@/lib/current-user-profile'
import db from '@/lib/db'

interface ConversationIdPageProps {
  params: Promise<{
    otherUserId: string
  }>
  searchParams: Promise<{
    video?: boolean
  }>
}

const ConversationIdPage = async ({ params, searchParams }: ConversationIdPageProps) => {
  const user = await currentProfile()
  const { otherUserId } = await params

  if (!user) {
    return redirect('/sign-in')
  }

  const conversation = await getOrCreateConversation(user.id!, otherUserId)

  if (!conversation) {
    return redirect('/')
  }

  const { profileOne, profileTwo } = conversation

  const otherUser = user.id === profileOne.id ? profileTwo : profileOne

  const connection = await db.connection.findFirst({
    where: {
      OR: [
        {
          profileOneId: user.id,
          profileTwoId: otherUser.id
        },
        {
          profileOneId: otherUser.id,
          profileTwoId: user.id
        }
      ]
    }
  })

  return (
    <div className='flex h-full flex-col bg-white dark:bg-[#313338]'>
      <DmHeader
        image={otherUser.image!}
        name={otherUser.name!}
        connection={connection}
        otherUserId={otherUser.id}
        profile={user}
      />
      {(await searchParams).video && <MediaRoom chatId={conversation.id} video={true} audio={true} />}
      {!(await searchParams).video && (
        <>
          <DmMessages
            profile={user}
            name={otherUser.name!}
            chatId={conversation.id}
            apiUrl='/api/direct-messages1'
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl='/api/socket/direct-messages1'
            socketQuery={{
              conversationId: conversation.id
            }}
          />
          <DmInput
            name={otherUser.name!}
            apiUrl='/api/socket/direct-messages1'
            query={{
              conversationId: conversation.id
            }}
          />
        </>
      )}
    </div>
  )
}

export default ConversationIdPage
