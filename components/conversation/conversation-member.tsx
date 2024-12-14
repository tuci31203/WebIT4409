'use client'

import { User } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'

import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'

interface ConversationMemberProps {
  profile: User
}

export const ConversationMember = ({ profile }: ConversationMemberProps) => {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/conversations/${profile.id}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.otherUserId === profile.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar src={profile.image!} className='h-8 w-8 md:h-8 md:w-8' isOnline={profile.isOnline} />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.otherUserId === profile.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {profile.name}
      </p>
    </button>
  )
}
