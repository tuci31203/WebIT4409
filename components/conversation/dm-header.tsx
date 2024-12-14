import { Connection, User } from '@prisma/client'

import { SocketIndicator } from '@/components/socket-indicator'
import { UserAvatar } from '@/components/user-avatar'

import { ConversationMobileToggle } from './conversation-mobile'
import { DmConnection } from './dm-connection'
import { DmVideoButton } from './dm-video-button'

interface DmHeaderProps {
  name: string
  image?: string
  connection: Connection | null
  otherUserId?: string
  profile: User
}

export const DmHeader = ({ name, image, connection, otherUserId, profile }: DmHeaderProps) => {
  return (
    <div className='text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800'>
      <ConversationMobileToggle profile={profile} />
      <UserAvatar src={image} className='mr-2 h-8 w-8 md:h-8 md:w-8' isOnline={profile.isOnline} />
      <p className='text-md mr-2 font-semibold text-black dark:text-white'>{name}</p>
      <DmConnection connection={connection} otherUserId={otherUserId} profileId={profile.id} />
      <div className='ml-auto flex items-center'>
        <DmVideoButton />
        <SocketIndicator />
      </div>
    </div>
  )
}
