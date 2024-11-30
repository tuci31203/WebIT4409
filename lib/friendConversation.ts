import { db } from "@/lib/db";

export const getOrCreateFriendConversation = async (connectionId: string) => {
    let conversation = await findFriendConversation(connectionId);
    if (!conversation) {
        conversation = await createNewFriendConversation(connectionId);
    }
    return conversation;
}

const findFriendConversation = async (connectionId: string) => {
    try {
        return await db.friendConversation.findFirst({
            where: {
                connectionId: connectionId,
            },
            include: {
                connection: {
                    include: {
                        profileOne: true,
                        profileTwo: true,
                    }
                }
            }
        });
    } catch (e) {
        console.log(e)
        return null;
    }
}

const createNewFriendConversation = async (connectionId: string) => {
    try {
        const connection = await db.connection.findUnique({
            where: { id: connectionId },
            include: {
                profileOne: true,
                profileTwo: true,
            }
        });

        if (!connection) {
            throw new Error("Connection not found");
        }

        return await db.friendConversation.create({
            data: {
                connectionId,
                memberOneId: connection.profileOneId,
                memberTwoId: connection.profileTwoId,
            },
            include: {
                connection: {
                    include: {
                        profileOne: true,
                        profileTwo: true,
                    }
                }
            }
        });
    } catch (e) {
        console.log(e)
        return null;
    }
}