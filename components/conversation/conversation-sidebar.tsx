import { db } from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ConversationHeader from "./conversation-header";
import { ConversationSearch } from "./conversation-search";
import { ConversationMember } from "./conversation-member";
import { ConnectionStatus, Profile } from "@prisma/client";



const ConversationSidebar = async ({ profile }: { profile: Profile }) => {
    const conversations = await db.conversation1.findMany({
        where: {
            OR: [
                { profileOneId: profile.id },
                { profileTwoId: profile.id }
            ]
        },
        include: {
            profileOne: true,
            profileTwo: true,
        }
    });

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

    const peopleChattedWith = conversations.map((conversation) => {
        if (conversation.profileOneId === profile.id) return conversation.profileTwo;
        return conversation.profileOne;
    });

    const friends = connections.map((connection) => {
        if (connection.profileOneId === profile.id) return connection.profileTwo;
        return connection.profileOne;
    });

    const otherPeople = peopleChattedWith.filter((user) => {
        return !friends.some((friend) => user.id === friend.id);
    })


    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
            <ConversationHeader />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ConversationSearch
                        profile={profile}
                        peopleChattedWith={peopleChattedWith}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                <div className="flex items-center justify-between py-2" >
                    <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400" >
                        Friends
                    </p>
                </div>
                {friends.map((userChatWith: Profile, index: number) => (
                    <ConversationMember
                        key={index}
                        profile={userChatWith}
                    />
                ))}
                <div className="flex items-center justify-between py-2" >
                    <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400" >
                        Other
                    </p>
                </div>
                {otherPeople.map((userChatWith: Profile, index: number) => (
                    <ConversationMember
                        profile={userChatWith}
                    />
                ))}

            </ScrollArea>
        </div>
    );
}

export default ConversationSidebar;