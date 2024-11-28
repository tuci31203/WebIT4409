import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { ConnectionStatus } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import Link from "next/link";

export const NavigationSidebar = async () => {
    const profile = await currentProfile()
    if (!profile) {
        return redirect("/")
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    const connections = await db.connection.findMany({
        where: {
            OR: [
                { profileOneId: profile.id },
                { profileTwoId: profile.id }
            ],
            status: ConnectionStatus.FRIEND
        },
        include: {
            profileOne: true,
            profileTwo: true,
        }
    });

    const friends = connections.map((connection, index: number) => {
        if(profile.id === connection.profileOneId) return connection.profileTwo;
        return connection.profileOne;
    });

    return (
        <div
            className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] bg-[#e3e5e8] py-3"
        >
            <NavigationAction />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            <ScrollArea className="flex-1 w-full">
                {servers.map(server => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            image={server.image}
                        />
                    </div>
                ))}
            </ScrollArea>
            {friends.length > 0 &&(
                <>
                <Separator
                    className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
                />
                <ScrollArea className="flex-1 w-full">
                    {friends.map(friend => (
                        <div 
                            key={friend.id} 
                            className="flex justify-center mb-4"
                        >
                            <ActionTooltip
                                side="right"
                                align="center"
                                label={friend.name}
                            >
                                <Link href={`/connections/${friend.id}`}>
                                    <UserAvatar 
                                        src={friend.image}
                                    />
                                </Link>
                                
                            </ActionTooltip>
                        </div>
                    ))}
                </ScrollArea>
                </>
            )}
            
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    );
};
