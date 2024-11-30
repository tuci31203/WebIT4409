import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { db } from "@/lib/db";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const profile = await currentProfilePages(req);
        const { friendMessageId, conversationId } = req.query;
        const { content } = req.body;

        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID missing" });
        }

        const conversation = await db.friendConversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOneId: profile.id,
                    },
                    {
                        memberTwoId: profile.id,
                    }
                ]
            },
            include: {
                memberOne: true,
                memberTwo: true
            }
        })

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const member = conversation.memberOneId === profile.id ? conversation.memberOne : conversation.memberTwo;

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        let friendMessage = await db.friendMessage.findFirst({
            where: {
                id: friendMessageId as string,
                conversationId: conversationId as string,
            },
            include: {
                member: true
            }
        })

        if (!friendMessage || friendMessage.deleted) {
            return res.status(404).json({ error: "Message not found" });
        }

        const isMessageOwner = friendMessage.memberId === member.id;
        const canModify = isMessageOwner;

        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (req.method === "DELETE") {
            friendMessage = await db.friendMessage.update({
                where: {
                    id: friendMessageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "This massage has been deleted.",
                    deleted: true,
                },
                include: {
                    member: true
                }
            })
        }

        if (req.method === "PATCH") {
            if (!isMessageOwner) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            friendMessage = await db.friendMessage.update({
                where: {
                    id: friendMessageId as string,
                },
                data: {
                    content,
                },
                include: {
                    member: true
                }
            })
        }

        const updateKey = `chat:${conversation.id}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, friendMessage);

        return res.status(200).json(friendMessage);

    } catch (error) {
        console.log("[MESSAGE_ID]", error);
        return res.status(500).json({ error: "Internal error" });
    }
}