import { redirect } from 'next/navigation'

import { ChatHeader } from '@/components/chat/chat-header'
import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const user = await currentProfile()
  const { serverId, channelId } = await params

  const channel = await db.channel.findUnique({
    where: {
      id: channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      userId: user?.id
    }
  })

  if (!channel || !member) {
    redirect('/')
  }

  return (
    <div className='flex h-full flex-col bg-white dark:bg-[#313338]'>
      <ChatHeader name={channel.name} serverId={channel.serverId} type='channel' />
    </div>
  )
}

export default ChannelIdPage
