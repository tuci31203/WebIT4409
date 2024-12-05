'use client'

import '@livekit/components-styles'

import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import useCurrentUser from '@/hooks/use-current-user'

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { data } = useCurrentUser()
  const [token, setToken] = useState('')

  useEffect(() => {
    const name = data?.user?.name as string

    ;(async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
        const data = await res.json()
        setToken(data.token)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [data, chatId])

  if (token === '') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <Loader2 className='my-4 h-7 w-7 animate-spin text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading media...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme='default'
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
