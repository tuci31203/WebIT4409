'use client'

import { User } from '@prisma/client'
import { MessageCircle, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useModal } from '@/hooks/use-modal-store'

import { ActionTooltip } from '../action-tooltip'
import { Separator } from '../ui/separator'
import { FriendRequestsTooltip } from './friend-requests-tooltip'

export const NavigationAction = ({ profile }: { profile: User }) => {
  const { onOpen } = useModal()
  const router = useRouter()

  return (
    <div className='flex flex-col items-center space-y-4'>
      <ActionTooltip side='right' align='center' label='Direct messages'>
        <button onClick={() => router.push('/conversations')} className='group flex items-center'>
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-indigo-500 dark:bg-neutral-700'>
            <MessageCircle
              className='text-indigo-500 transition group-hover:text-white dark:text-indigo-200'
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
      <FriendRequestsTooltip profile={profile} />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ActionTooltip side='right' align='center' label='Add a server'>
        <button onClick={() => onOpen('createServer')} className='group flex items-center'>
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-indigo-500 dark:bg-neutral-700'>
            <Plus className='text-indigo-500 transition group-hover:text-white dark:text-indigo-200' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
