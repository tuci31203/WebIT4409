'use client'

import { User } from '@prisma/client'
import axios from 'axios'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { UserAvatar } from '../user-avatar'

const SearchedUser = ({ user, onClick }: { user: User; onClick: () => void }) => {
  return (
    <div className='flex cursor-pointer items-center gap-x-2' onClick={onClick}>
      <UserAvatar src={user.image!} className='h-8 w-8 md:h-8 md:w-8' />
      <div className='flex flex-col gap-y-1'>
        <p className='flex items-center gap-x-1 text-xs font-semibold'>{user.name}</p>
        <p className='text-xs text-zinc-500'>{user.email}</p>
      </div>
    </div>
  )
}

interface ConversationSearchProps {
  profile: User
  peopleChattedWith: User[]
}

export const ConversationSearch = ({ profile, peopleChattedWith }: ConversationSearchProps) => {
  const [open, setOpen] = useState(false)
  const [peopleFound, setPeopleFound] = useState<User[]>([])
  const [conversationsFound, setConversationsFound] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    setConversationsFound(peopleChattedWith)
  }, [peopleChattedWith])

  const onSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value
    if (!keyword) {
      setConversationsFound(peopleChattedWith)
    } else {
      try {
        const res = await axios.get(`/api/profiles/name/${keyword}`)
        const people = res.data
        const results: User[] = []
        setConversationsFound(
          people.filter((user: User) => {
            if (peopleChattedWith.some(acquaintance => user.id === acquaintance.id)) return true
            else {
              results.push(user)
              return false
            }
          })
        )
        setPeopleFound(results)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const onUserClick = (otherUserId: string) => {
    router.push(`/conversations/${otherUserId}`)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50'
      >
        <Search className='h-4 w-4 text-zinc-500 dark:text-zinc-400' />
        <p className='text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300'>
          Search
        </p>
        <kbd className='pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='overflow-hidden bg-white p-0 text-black'>
          <DialogHeader className='px-6 pt-8'>
            <DialogTitle className='text-center text-2xl font-bold'>Find your friends</DialogTitle>
            <Input
              placeholder='Search'
              onChange={onSearch}
              className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </DialogHeader>
          <ScrollArea className='mb-6 max-h-[420px] px-6'>
            {peopleFound.length === 0 && conversationsFound.length === 0 && (
              <div className='flex flex-1 flex-col items-center justify-center'>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>No users found</p>
              </div>
            )}
            {peopleFound.length > 0 && (
              <div className='mb-6'>
                <div className='text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70'>People</div>
                {peopleFound.map((profile: User, index: number) => (
                  <SearchedUser user={profile} onClick={() => onUserClick(profile.id)} key={index} />
                ))}
              </div>
            )}
            {conversationsFound.length > 0 && (
              <div>
                <div className='mb-3 text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70'>
                  Conversations
                </div>
                {conversationsFound.map((profile: User, index: number) => (
                  <SearchedUser user={profile} onClick={() => onUserClick(profile.id)} key={index} />
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
