'use client'

import { Rocket } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useSocket } from '../providers/socket-provider'

export const EmojiEffectButton = () => {
  const { socket } = useSocket()
  const FULL_SCREEN_EMOJIS = ['❤️', '🎉', '🤣', '✨', '🔥']
  const triggerEmojiEffect = (emoji: string) => {
    if (socket) {
      console.log('triggerEmojiEffect', emoji)
      socket.emit('emoji-effect', emoji)
    }
  }
  return (
    <Popover>
      <PopoverTrigger>
        <Rocket className='text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300' />
      </PopoverTrigger>
      <PopoverContent
        side='right'
        sideOffset={-150}
        className='mb-16 border-none bg-transparent shadow-none drop-shadow-none'
      >
        <div className='flex space-x-1'>
          {FULL_SCREEN_EMOJIS.map(emoji => (
            <button
              key={emoji}
              type='button'
              onClick={() => triggerEmojiEffect(emoji)}
              className='text-xl transition hover:scale-125'
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
