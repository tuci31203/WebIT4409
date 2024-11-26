import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string
  name?: string
  className?: string
}

const COLORS = [
  'bg-pink-200 text-pink-800',
  'bg-purple-200 text-purple-800',
  'bg-indigo-200 text-indigo-800',
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-red-200 text-red-800',
  'bg-orange-200 text-orange-800',
  'bg-teal-200 text-teal-800',
  'bg-cyan-200 text-cyan-800'
]

const getColorFromName = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % COLORS.length
  return COLORS[index]
}

export const UserAvatar = ({ src, name, className }: UserAvatarProps) => {
  const initial = name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('') as string

  const avatarColor = getColorFromName(name as string)

  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={avatarColor}>{initial}</AvatarFallback>
    </Avatar>
  )
}
