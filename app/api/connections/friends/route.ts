import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ConnectionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const friendConnections = await db.connection.findMany({
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

        const friends = friendConnections.map(connection => {
            if(connection.profileOneId === profile.id) return connection.profileTwo;
            return connection.profileOne;
        })

        return NextResponse.json(friends);
    } catch(err) {
        console.log("[STRANGER_CONVERSATIONS_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}