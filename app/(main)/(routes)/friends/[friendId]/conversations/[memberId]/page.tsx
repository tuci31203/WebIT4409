import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateFriendConversation } from "@/lib/friendConversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatFriendMessages } from "@/components/chat/chat-friend-message";

interface FriendIdPageProps {
    params: {
        memberId: string;
        friendId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

const FriendIdPage = async ({
    params,
    searchParams,
}: FriendIdPageProps) => {
    const profile = await currentProfile();
    const { friendId, memberId } = await params;
    const { video } = await searchParams;

    if (!profile) {
        redirect('/sign-in'); // Redirects server-side to the sign-in page
        return null;
    }

    const connection = await db.connection.findFirst({
        where: {
            id: friendId,
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

    if (!connection) {
        console.log("No connection found");
        return redirect("/");
    }

    const conversation = await getOrCreateFriendConversation(friendId);

    if (!conversation) {
        console.log("No conversation found");
        return redirect("/");
    }

    const otherMember = connection.profileOne.id === profile.id ? connection.profileTwo : connection.profileOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                image={otherMember.image}
                name={otherMember.name}
                serverId={friendId}
                type="conversation"
                connection={connection}
                profileId={otherMember.id}
            />
            {video ? (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            ) : (
                <>
                    <ChatFriendMessages
                        member={profile}
                        name={otherMember.name}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/friend-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/friend-messages"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />
                    <ChatInput
                        name={otherMember.name}
                        type="conversation"
                        apiUrl="/api/socket/friend-messages"
                        query={{
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default FriendIdPage;