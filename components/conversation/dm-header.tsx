import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { Connection } from "@prisma/client";
import { DmConnection } from "./dm-connection";
import { DmVideoButton } from "./dm-video-button";

interface DmHeaderProps {
    name: string;
    image?: string;
    connection: Connection | null,
    profileId?: string;
}


export const DmHeader = ({
    name,
    image,
    connection,
    profileId
}: DmHeaderProps) => {
    
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <UserAvatar
                src={image}
                className="h-8 w-8 md:h-8 md:w-8 mr-2"
            />
            <p className="font-semibold text-md text-black dark:text-white mr-2">
                {name}
            </p>
            <DmConnection 
                connection={connection}
                profileId={profileId}
            />
            <div className="ml-auto flex items-center" >
                <DmVideoButton />
                <SocketIndicator />
            </div>
        </div>
    )
}