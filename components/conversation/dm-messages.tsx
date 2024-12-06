'use client'

import { Message, User } from '@prisma/client'
import { format } from 'date-fns'
import { Loader2, ServerCrash } from 'lucide-react'
import { ElementRef, Fragment, useRef } from 'react'

import { useChatQuery } from '@/hooks/use-chat-query'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatSocket } from '@/hooks/use-chat-socket'

import { DmItem } from './dm-item'
import { DmWelcome } from './dm-welcome'

type MessageWithProfile = Message & {
  profile: User
}

interface DmMessagesProps {
  name: string
  profile: User
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss' // Định dạng ngày giờ

export const DmMessages = ({
  name,
  profile,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue
}: DmMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })
  useChatSocket({ queryKey, addKey, updateKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0
  })

  if (status === 'pending') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <Loader2 className='my-4 h-7 w-7 animate-spin text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading messages...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <ServerCrash className='my-4 h-7 w-7 text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Something went wrong!</p>
      </div>
    )
  }

  return (
    <div ref={chatRef} className='flex flex-1 flex-col overflow-y-auto py-4'>
      {!hasNextPage && <div className='flex-1' />}
      {!hasNextPage && <DmWelcome name={name} />}
      {hasNextPage && (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='my-4 h-6 w-6 animate-spin text-zinc-500' />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className='my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
            >
              Load preview messages
            </button>
          )}
        </div>
      )}
      <div className='mt-auto flex flex-col-reverse'>
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map((message: MessageWithProfile) => (
              <DmItem
                key={message.id}
                id={message.id}
                currentUser={profile}
                profile={message.profile}
                content={message.content || ''}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
