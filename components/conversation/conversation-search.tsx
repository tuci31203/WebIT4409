'use client'

import { User } from '@prisma/client'
import axios from 'axios'
import { Loader2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

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
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const ConversationSearch = ({ profile }: { profile: User }) => {
  const [open, setOpen] = useState(false)
  const [peopleChattedWith, setPeopleChattedWith] = useState<User[]>([])
  const [peopleFound, setPeopleFound] = useState<User[]>([])
  const [conversationsFound, setConversationsFound] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
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

  const onOpenDialog = async () => {
    try {
      const res = await axios.get('/api/conversations/partners')
      setPeopleChattedWith(res.data)
      setConversationsFound(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setOpen(true)
    }
  }

  const onSearch = async (keyword: string, cancelToken: any) => {
    if (!keyword || keyword.trim().length === 0) {
      setConversationsFound(peopleChattedWith)
      setPeopleFound([])
    } else {
      try {
        setIsLoading(true)
        const res = await axios.get(`/api/users/search/${keyword}`, { cancelToken })
        const people = res.data
        const results: User[] = []
        setConversationsFound(
          people.filter((user: User) => {
            if (peopleChattedWith.some((acquaintance: User) => user.id === acquaintance.id)) return true
            else {
              results.push(user)
              return false
            }
          })
        )
        setPeopleFound(results)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnSearch = useCallback(
    debounce((keyword: string, cancelToken: any) => onSearch(keyword, cancelToken), 1000),
    [peopleChattedWith]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()
    debouncedOnSearch(keyword, cancelTokenSource.token)
    return () => cancelTokenSource.cancel('Request cancelled')
  }, [debouncedOnSearch, keyword])

  const onUserClick = (otherUserId: string) => {
    router.push(`/conversations/${otherUserId}`)
    setOpen(false)
  }

  return (
    <>
      <button
        disabled={isLoading}
        onClick={onOpenDialog}
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
      <Dialog
        open={open}
        onOpenChange={() => {
          if (open == true) {
            setConversationsFound([])
            setPeopleFound([])
          }
          setOpen(!open)
        }}
      >
        <DialogContent className='overflow-hidden bg-white p-0 text-black'>
          <DialogHeader className='px-6 pt-8'>
            <DialogTitle className='text-center text-2xl font-bold'>Find your friends</DialogTitle>
            <Input
              placeholder='Search by name or email'
              onChange={e => setKeyword(e.target.value)}
              value={keyword}
              className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </DialogHeader>
          <ScrollArea className='mb-6 max-h-[420px] px-6'>
            {isLoading && <Loader2 className='mx-auto h-6 w-6 animate-spin text-zinc-500' />}
            {!isLoading && peopleFound.length === 0 && conversationsFound.length === 0 && (
              <div className='flex flex-1 flex-col items-center justify-center'>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>No users found</p>
              </div>
            )}
            {!isLoading && peopleFound.length > 0 && (
              <div className={cn('flex flex-col gap-2', conversationsFound.length > 0 && 'mb-6')}>
                <div className='text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70'>People</div>
                {peopleFound.map((profile: User, index: number) => (
                  <SearchedUser user={profile} onClick={() => onUserClick(profile.id)} key={index} />
                ))}
              </div>
            )}
            {!isLoading && conversationsFound.length > 0 && (
              <div className='flex flex-col gap-2'>
                <div className='text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70'>Conversations</div>
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
