'use client'

import { Member, MemberRole, Server, User } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'

interface ServerMemberProps {
  member: Member & { user: User }
  server: Server
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='ml-2 h-4 w-4 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='ml-2 h-4 w-4 text-rose-500' />
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams()
  const router = useRouter()

  const icon = roleIconMap[member.role]

  const onClick = () => {
    router.push(`/conversations/${member.user.id}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar src={member?.user?.image ?? undefined} name={member?.user?.name as string} className='h-8 w-8' />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member?.user?.name}
      </p>
      {icon}
    </button>
  )
}
