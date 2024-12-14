'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { ActionTooltip } from '@/components/action-tooltip'
import { cn } from '@/lib/utils'

interface NaviagtionItemProps {
  id: string
  image: string
  name: string
}

export const NavigationItem = ({ id, image, name }: NaviagtionItemProps) => {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip side='right' align='center' label={name}>
      <button onClick={onClick} className='group relative flex items-center'>
        <div
          className={cn(
            'absolute left-0 w-[4px] rounded-r-full bg-primary transition-all',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />

        <div
          className={cn(
            'group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]',
            params?.serverId === id && 'rounded-[16px] bg-primary/10 text-primary'
          )}
        >
          <Image fill src={image} alt='Channel' />
        </div>
      </button>
    </ActionTooltip>
  )
}
