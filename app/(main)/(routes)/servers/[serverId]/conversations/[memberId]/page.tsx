import { redirect } from 'next/navigation'

import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { EmojiEffectHandler } from '@/components/effects/emoji-effect-handler'
import { MediaRoom } from '@/components/media-room'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-user-profile'
import db from '@/lib/db'

interface MemberIdPageProps {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const user = await currentProfile()
  const { memberId, serverId } = await params
  const { video } = await searchParams

  if (!user) {
    return redirect('/sign-in')
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId,
      userId: user?.id
    },
    include: {
      user: true
    }
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId)

  if (!conversation) {
    return redirect(`/servers/${serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.userId === user?.id ? memberTwo : memberOne

  return (
    <div className='flex h-full flex-col bg-white dark:bg-[#313338]'>
      <EmojiEffectHandler />
      <ChatHeader
        image={otherMember.user.image!}
        name={otherMember.user.name!}
        serverId={serverId}
        type='conversation'
      />
      {video && <MediaRoom chatId={conversation.id} video={true} audio={true} />}
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.user.name ?? 'user'}
            chatId={conversation.id}
            type='conversation'
            apiUrl='/api/direct-messages'
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl='/api/socket/direct-messages'
            socketQuery={{
              conversationId: conversation.id
            }}
          />
          <ChatInput
            name={otherMember.user.name ?? 'user'}
            type='conversation'
            apiUrl='/api/socket/direct-messages'
            query={{
              conversationId: conversation.id
            }}
          />
        </>
      )}
    </div>
  )
}

export default MemberIdPage
