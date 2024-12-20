'use client'

import { Connection, ConnectionStatus } from '@prisma/client'
import axios from 'axios'
import { UserRoundCheck, UserRoundPlus, UserRoundX, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ConnectionWithProfile } from '@/types'

import { useSocket } from '../providers/socket-provider'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

interface DmConnectionProps {
  connection: Connection | null
  otherUserId?: string
  profileId?: string
}

export const DmConnection = ({ connection, otherUserId, profileId }: DmConnectionProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [connectionId, setConnectionId] = useState(connection?.id)
  const { socket } = useSocket()
  const router = useRouter()

  useEffect(() => {
    if (!connection) return
    if (connection?.status === ConnectionStatus.FRIEND) setStatus('friends')
    if (connection?.status === ConnectionStatus.REQUESTING) {
      if (connection.profileOneId === otherUserId) setStatus('requested')
      else setStatus('requesting')
    }
  }, [connection, otherUserId])

  useEffect(() => {
    if (!socket) return

    const newRequestKey = `connections:${profileId}:incoming`
    const newFriendKey = `connections:${profileId}:newfriends`
    const deleteKey = `connections:${profileId}:delete`

    socket.on(newRequestKey, (newRequest: ConnectionWithProfile) => {
      if (newRequest.profileOneId === otherUserId) {
        setConnectionId(newRequest.id)
        setStatus('requested')
      }
    })
    socket.on(newFriendKey, (newFriend: ConnectionWithProfile) => {
      if (newFriend.profileTwoId === otherUserId) {
        setConnectionId(newFriend.id)
        setStatus('friends')
      }
    })
    socket.on(deleteKey, (deletedConnection: ConnectionWithProfile) => {
      if (deletedConnection.profileOneId === otherUserId || deletedConnection.profileTwoId === otherUserId) {
        setStatus('')
        setConnectionId(deletedConnection.id)
      }
    })

    return () => {
      socket.off(newRequestKey)
      socket.off(newFriendKey)
      socket.off(deleteKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, profileId])
  const onAddFriend = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post('/api/socket/connections', { requestedProfileId: otherUserId })
      setConnectionId(res.data?.id)
      setStatus('requesting')
    } catch (err) {
      router.refresh()
      window.location.reload()
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  // For unfriend, decline, cancel request
  const onUnrequest = async () => {
    try {
      setIsLoading(true)
      const res = await axios.delete(`/api/socket/connections/${connectionId}`)
      setConnectionId(res.data?.id)
      setStatus('')
    } catch (err) {
      router.refresh()
      window.location.reload()
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const onAccept = async () => {
    try {
      setIsLoading(true)
      const res = await axios.patch(`/api/socket/connections/${connectionId}`)
      setConnectionId(res.data?.id)
      setStatus('friends')
    } catch (err) {
      router.refresh()
      window.location.reload()
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'friends') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isLoading} variant='friend' size='connection' className='focus-visible:outline-none'>
            <UserRoundCheck className='h-4 w-4' />
            Friends
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' alignOffset={8}>
          <DropdownMenuItem onClick={onUnrequest} className='px-1 py-1 text-sm'>
            <UserRoundX className='h-4 w-4' />
            Unfriend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  if (status === 'requesting') {
    return (
      <Button disabled={isLoading} variant='not_friend' size='connection' onClick={onUnrequest}>
        <UserRoundX className='h-4 w-4' />
        Cancel request
      </Button>
    )
  }
  if (status === 'requested') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isLoading} variant='not_friend' size='connection' className='focus-visible:outline-none'>
            <UserRoundCheck className='h-4 w-4' />
            Respond
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' alignOffset={8}>
          <DropdownMenuItem onClick={onAccept} className='px-1 py-1 text-sm'>
            <UserRoundCheck className='h-4 w-4' />
            Accept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUnrequest} className='px-1 py-1 text-sm'>
            <X className='h-4 w-4' />
            Decline
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button disabled={isLoading} variant='not_friend' size='connection' onClick={onAddFriend}>
      <UserRoundPlus className='h-4 w-4' />
      Add friend
    </Button>
  )
}
