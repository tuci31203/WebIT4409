import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { FriendMessage } from "@prisma/client";

const MESSAGES_BATCH = 10;

export async function GET(
    req: Request
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        let messages: FriendMessage[] = [];

        if (cursor) {
            messages = await db.friendMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId,
                },
                include: {
                    member: true
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        } else {
            messages = await db.friendMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId,
                },
                include: {
                    member: true
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        }

        return NextResponse.json(messages);
    } catch (e) {
        console.log("[FRIEND_MESSAGES_GET] ", e);
        return new NextResponse("Internal error", { status: 500 });
    }
}