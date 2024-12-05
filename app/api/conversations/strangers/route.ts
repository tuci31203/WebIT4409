import { currentProfile } from "@/lib/current-user-profile";
import db from "@/lib/db";
import { ConnectionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const conversations = await db.conversation1.findMany({
            where: {
                OR: [
                    { profileOneId: profile.id },
                    { profileTwoId: profile.id }
                ],
            },
            include: {
                profileOne: true,
                profileTwo: true,
            }
        });

        const peopleChattedWith = conversations.map(conversation => {
            if (conversation.profileOneId === profile.id) return conversation.profileTwo;
            return conversation.profileOne;
        });

        const friendConnections = await db.connection.findMany({
            where: {
                OR: [
                    { profileOneId: profile.id },
                    { profileTwoId: profile.id }
                ],
                status: ConnectionStatus.FRIEND,
            },
            include: {
                profileOne: true,
                profileTwo: true,
            }
        });

        const friends = friendConnections.map(connection => {
            if (connection.profileOneId === profile.id) return connection.profileTwo;
            return connection.profileOne;
        });

        const strangers = peopleChattedWith.filter(user => {
            return !(friends.some(friend => user.id === friend.id));
        })


        return NextResponse.json(strangers);
    } catch (err) {
        console.log("[CONVERSATIONS_STRANGERS_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}