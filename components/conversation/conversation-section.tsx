'use client'

import { User } from '@prisma/client'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ConnectionWithProfile } from '@/types'

import { useSocket } from '../providers/socket-provider'
import { ConversationMember } from './conversation-member'

const ConversationSection = ({ profile }: { profile: User }) => {
  const [isFetching, setIsFetching] = useState(true)
  const [friends, setFriends] = useState([])
  const [otherPeople, setOtherPeople] = useState([])
  const [error, setError] = useState(false)
  const { socket } = useSocket()
  const fetchData = async () => {
    try {
      setIsFetching(true)
      const res = await axios.get('/api/connections/friends')
      const res1 = await axios.get('/api/conversations/strangers')
      setFriends(res.data)
      setOtherPeople(res1.data)
    } catch (err) {
      setError(true)
      console.log(err)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!socket) return

    const newFriendKey = `connections:${profile.id}:newfriends`
    const deleteKey = `connections:${profile.id}:delete`
    socket.on(newFriendKey, (newFriend: ConnectionWithProfile) => {
      console.log(newFriend)
      fetchData()
    })

    socket.on(deleteKey, (deleteConnection: ConnectionWithProfile) => {
      console.log(deleteConnection)
      fetchData()
    })

    return () => {
      socket.off(newFriendKey)
      socket.off(deleteKey)
    }
  }, [socket, profile])

  if (isFetching) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='my-4 h-7 w-7 animate-spin text-zinc-500' />
      </div>
    )
  }

  if (error) {
    return (
      <p className='flex h-full items-center justify-center py-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400'>
        There has been an error.
      </p>
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2 py-2'>
        <p className='text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400'>Friends</p>
        {friends.map((friend: User, index: number) => (
          <ConversationMember key={index} profile={friend} />
        ))}
      </div>
      <div className='flex flex-col gap-2 py-2'>
        <p className='text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400'>Other</p>
        {otherPeople.map((otherUser: User, index: number) => (
          <ConversationMember key={index} profile={otherUser} />
        ))}
      </div>
    </div>
  )
}

export default ConversationSection
