'use client'

import { User } from '@prisma/client'
import axios from 'axios'
import { UserRoundCheck, UserRoundPlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ConnectionWithProfile } from '@/types'

import { ActionTooltip } from '../action-tooltip'
import { useSocket } from '../providers/socket-provider'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ScrollArea } from '../ui/scroll-area'
import { UserAvatar } from '../user-avatar'

export const FriendRequestsTooltip = ({ profile }: { profile: User }) => {
  const [open, setOpen] = useState(false)
  const [requests, setRequests] = useState<ConnectionWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewRequests, setHasNewRequests] = useState(() => {
    const newReq = localStorage.getItem('hasNewRequests')
    if (newReq != null) {
      return JSON.parse(newReq)
    } else {
      localStorage.setItem('hasNewRequests', JSON.stringify(false))
      return false
    }
  })

  const { socket } = useSocket()
  useEffect(() => {
    if (!socket) {
      return
    }
    console.log('SOCKET')
    const newRequestKey = `connections:${profile.id}:incoming`
    const deleteRequestKey = `connections:${profile.id}:delete`
    socket.on(newRequestKey, (connection: ConnectionWithProfile) => {
      setRequests(requests => requests.concat([connection]))
      setHasNewRequests(!open)
      localStorage.setItem('hasNewRequests', JSON.stringify(!open))
    })

    socket.on(deleteRequestKey, (deletedConnection: ConnectionWithProfile) => {
      console.log('DELETE', deletedConnection)
      setRequests(requests => requests.filter(connection => connection.id !== deletedConnection.id))
      if (requests.length === 0) {
        setHasNewRequests(false)
        localStorage.setItem('hasNewRequests', JSON.stringify(false))
      }
    })

    return () => {
      socket.off(newRequestKey)
      socket.off(deleteRequestKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, profile])

  const onOpenRequests = async () => {
    try {
      const res = await axios.get('/api/connections/incoming_requests')
      setRequests(res.data)
      setOpen(true)
      setHasNewRequests(false)
      localStorage.setItem('hasNewRequests', JSON.stringify(false))
    } catch (err) {
      setOpen(false)
      console.log(err)
    }
  }
  const onAccept = async (connectionId: string) => {
    try {
      setIsLoading(true)
      const res = await axios.patch(`/api/socket/connections/${connectionId}`)
      setRequests(requests => requests.filter(connection => connection.id !== connectionId))
    } catch (err) {
      console.log(err)
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }
  const onDecline = async (connectionId: string) => {
    try {
      setIsLoading(true)
      const res = await axios.delete(`/api/socket/connections/${connectionId}`)
      setRequests(requests => requests.filter(connection => connection.id !== connectionId))
    } catch (err) {
      console.log(err)
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <ActionTooltip side='right' align='center' label='Friend requests'>
        <button onClick={onOpenRequests} className='group relative flex items-center'>
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-indigo-500 dark:bg-neutral-700'>
            <UserRoundPlus
              className='text-indigo-500 transition group-hover:text-white dark:text-indigo-200'
              size={25}
            />
          </div>
          {hasNewRequests && <span className='absolute right-[4px] top-0 h-3 w-3 rounded-full bg-teal-500'></span>}
        </button>
      </ActionTooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='overflow-hidden bg-white p-0 text-black'>
          <DialogHeader className='px-6 pt-8'>
            <DialogTitle className='text-center text-xl font-bold'>Friend Requests</DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>{requests.length} Requests</DialogDescription>
          </DialogHeader>
          <ScrollArea className='mt-8 max-h-[420px] px-6 pb-4'>
            {requests.map((connection, index) => {
              return (
                <div className='mb-2 flex items-center gap-x-2' key={index}>
                  <UserAvatar
                    src={connection.profileOne.image!}
                    className='h-8 w-8 md:h-8 md:w-8'
                    isOnline={connection.profileOne.isOnline}
                  />
                  <div className='flex flex-col gap-y-1'>
                    <p className='flex items-center gap-x-1 text-xs font-semibold'>{connection.profileOne.name}</p>
                    <p className='text-xs text-zinc-500'>{connection.profileOne.email}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className='ml-auto'>
                      <Button
                        disabled={isLoading}
                        variant='not_friend'
                        size='connection'
                        className='focus-visible:outline-none'
                      >
                        <UserRoundCheck className='h-4 w-4' />
                        Respond
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start' alignOffset={8}>
                      <DropdownMenuItem onClick={() => onAccept(connection.id)} className='px-1 py-1 text-sm'>
                        <UserRoundCheck className='h-4 w-4' />
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDecline(connection.id)} className='px-1 py-1 text-sm'>
                        <X className='h-4 w-4' />
                        Decline
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
