"use client";

import { Rocket } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useSocket } from "../providers/socket-provider";

export const EmojiEffectButton = () => {
    const { socket } = useSocket();
    const FULL_SCREEN_EMOJIS = ['❤️', '🎉', '🤣', '✨', '🔥'];
    const triggerEmojiEffect = (emoji: string) => {
        if (socket) {
            console.log('triggerEmojiEffect', emoji);
            socket.emit('emoji-effect', emoji);
        }
    }
    return (
        <Popover>
            <PopoverTrigger>
                <Rocket
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
            </PopoverTrigger>
            <PopoverContent
                side="right"
                sideOffset={-150}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <div className="flex space-x-1">
                    {FULL_SCREEN_EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => triggerEmojiEffect(emoji)}
                            className="text-xl hover:scale-125 transition"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}