"use client";

import { cn } from "@/lib/utils";
import { Profile } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";

interface ConversationMemberProps {
    profile: Profile
}


export const ConversationMember = ({
    profile
}: ConversationMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/conversations/${profile.id}`)
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.otherUserId === profile.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar
                src={profile.image}
                className="h-8 w-8 md:h-8 md:w-8"
            />
            <p
                className={cn(
                    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.otherUserId === profile.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {profile.name}
            </p>
        </button>
    )
}