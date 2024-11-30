import Link from "next/link";
import { ActionTooltip } from "./action-tooltip";
import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface FriendAvatarProps {
    src?: string;
    className?: string;
    tooltip: string;
    friendId: string;
    memberId: string;
};

export const FriendAvatar = ({
    src,
    className,
    tooltip,
    friendId,
    memberId,
}: FriendAvatarProps) => {

    return (
        <div className="flex justify-center mb-4">
            <ActionTooltip
                side="right"
                align="center"
                label={tooltip}
            >
                <Link href={`/friends/${friendId}/conversations/${memberId}`}>
                    <Avatar
                        className={cn(
                            "h-[48px] w-[48px]",
                            className
                        )}
                    >
                        <AvatarImage
                            src={src}
                        />
                    </Avatar>
                </Link>
            </ActionTooltip>
        </div>
    )
}