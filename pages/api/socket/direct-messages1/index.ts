import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import db from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const profile = await currentProfilePages({ req, res });
        const { content, fileUrl } = req.body;
        const { conversationId } = req.query;

        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID missing" });
        }
        if (!content) {
            return res.status(400).json({ error: "Content missing" });
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
                profileTwo: true
            }
        })

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const message = await db.directMessage1.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                profileId: profile.id,
            },
            include: {
                profile: true
            }
        });

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    } catch (error) {
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}