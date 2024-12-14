import { Hash } from 'lucide-react'

import { MobileToggle } from '@/components/mobile-toggle'
import { SocketIndicator } from '@/components/socket-indicator'
import { UserAvatar } from '@/components/user-avatar'

import { ChatVideoButton } from './chat-video-button'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  image?: string
  isOnline?: boolean
}

export const ChatHeader = ({ serverId, name, type, image, isOnline }: ChatHeaderProps) => {
  return (
    <div className='text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800'>
      <MobileToggle serverId={serverId} />
      {type === 'channel' && <Hash className='mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400' />}
      {type === 'conversation' && <UserAvatar src={image} className='mr-2 h-8 w-8 md:h-8 md:w-8' isOnline={isOnline} />}
      <p className='text-md mr-2 font-semibold text-black dark:text-white'>{name}</p>
      <div className='ml-auto flex items-center'>
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  )
}
