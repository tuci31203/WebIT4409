import db from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ConversationHeader from "./conversation-header";
import { ConversationSearch } from "./conversation-search";
import { User } from "@prisma/client";
import ConversationSection from "./conversation-section";



const ConversationSidebar = async ({ profile }: { profile: User }) => {
    const conversations = await db.conversation1.findMany({
        where: {
            OR: [
                { profileOneId: profile.id },
                { profileTwoId: profile.id }
            ]
        },
        orderBy: {
            updatedAt: "desc",
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
                <ConversationSection profile={profile} />
            </ScrollArea>
        </div>
    );
}

export default ConversationSidebar;