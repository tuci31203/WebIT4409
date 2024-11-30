import { DmHeader } from "@/components/conversation/dm-header";
import { DmInput } from "@/components/conversation/dm-input";
import { DmMessages } from "@/components/conversation/dm-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation1";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ConversationIdPageProps {
    params: {
        otherUserId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

const ConversationIdPage = async ({
    params,
    searchParams,
}: ConversationIdPageProps) => {
    const profile = await currentProfile();
    const { otherUserId } = await params

    if (!profile) {
        return <RedirectToSignIn />;
    }

    const conversation = await getOrCreateConversation(profile.id, otherUserId);

    if (!conversation) {
        return redirect("/");
    }

    const { profileOne, profileTwo } = conversation;

    const otherUser = profile.id === profileOne.id ? profileTwo : profileOne;

    const connection = await db.connection.findFirst({
        where: {
            OR: [
                {
                    profileOneId: profile.id,
                    profileTwoId: otherUser.id
                },
                {
                    profileOneId: otherUser.id,
                    profileTwoId: profile.id,
                },
            ]
        }
    });


    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full" >
            <DmHeader
                image={otherUser.image}
                name={otherUser.name}
                connection={connection}
                profileId={otherUser.id}
                profile={profile}
            />
            {(await searchParams).video && (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            )}
            {!(await searchParams).video && (
                <>
                    <DmMessages
                        profile={profile}
                        name={otherUser.name}
                        chatId={conversation.id}
                        apiUrl="/api/direct-messages1"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages1"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />
                    <DmInput
                        name={otherUser.name}
                        apiUrl="/api/socket/direct-messages1"
                        query={{
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default ConversationIdPage;
