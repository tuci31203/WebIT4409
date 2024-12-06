import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import db from "@/lib/db";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const profile = await currentProfilePages({ req, res });
        const { directMessageId, conversationId } = req.query;
        const { content } = req.body;

        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID missing" });
        }

        const conversation = await db.conversation1.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        profileOneId: profile.id
                    },
                    {
                        profileTwoId: profile.id
                    },
                ]
            },
            include: {
                profileOne: true,
                profileTwo: true,
            }
        })

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        let directMessage = await db.directMessage1.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
            },
            include: {
                profile: true,
            }
        })

        if (!directMessage || directMessage.deleted) {
            return res.status(404).json({ error: "Message not found" });
        }

        const isMessageOwner = directMessage.profileId === profile.id;
        const canModify = isMessageOwner;

        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (req.method === "DELETE") {
            directMessage = await db.directMessage1.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "This massage has been deleted.",
                    deleted: true,
                },
                include: {
                    profile: true
                }
            })
        }

        if (req.method === "PATCH") {
            if (!isMessageOwner) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            directMessage = await db.directMessage1.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    content,
                },
                include: {
                    profile: true
                }
            })
        }

        const updateKey = `chat:${conversation.id}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, directMessage);

        return res.status(200).json(directMessage);

    } catch (error) {
        console.log("[MESSAGE_ID]", error);
        return res.status(500).json({ error: "Internal error" });
    }
}