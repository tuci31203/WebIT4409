'use client'

import { MessageCircle, Plus } from "lucide-react"
import { ActionTooltip } from "../action-tooltip"
import { useModal } from "@/hooks/use-modal-store"
import { useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { User } from "@prisma/client"
import { FriendRequestsTooltip } from "./friend-requests-tooltip"

export const NavigationAction = ({ profile }: { profile: User }) => {
    const { onOpen } = useModal()
    const router = useRouter();

    return (
        <div className="space-y-4 flex flex-col items-center">
            <ActionTooltip
                side="right"
                align="center"
                label="Direct messages"
            >
                <button
                    onClick={() => router.push('/conversations')}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-indigo-500">
                        <MessageCircle
                            className="group-hover:text-white transition dark:text-indigo-200 text-indigo-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
            <FriendRequestsTooltip profile={profile} />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            <ActionTooltip
                side="right"
                align="center"
                label="Add a server"
            >
                <button
                    onClick={() => onOpen("createServer")}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-indigo-500">
                        <Plus
                            className="group-hover:text-white transition dark:text-indigo-200 text-indigo-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}
