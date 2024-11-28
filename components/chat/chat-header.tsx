import { Hash, UserRoundCheck } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "./chat-video-button";
import { Connection, ConnectionStatus } from "@prisma/client";
import { Button } from "../ui/button";
import axios from "axios";
import { ChatConnection } from "./chat-connection";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    image?: string;
    connection?: Connection | undefined,
    profileId?: string;
}


export const ChatHeader = ({
    serverId,
    name,
    type,
    image,
    connection,
    profileId
}: ChatHeaderProps) => {
    
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            {type === "conversation" && (
                <UserAvatar
                    src={image}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                />
            )}
            <p className="font-semibold text-md text-black dark:text-white mr-2">
                {name}
            </p>
            {type === "conversation" && (
                <ChatConnection 
                    connection={connection}
                    profileId={profileId}
                />
            )}
            <div className="ml-auto flex items-center" >
                {type === "conversation" && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}