import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ConnectionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const connections = await db.connection.findMany({
            where: {
                profileTwoId: profile.id,
                status: ConnectionStatus.REQUESTING
            },
            include: {
                profileOne: true,
                profileTwo: true,
            }
        });
        return NextResponse.json(connections);
    } catch(e) {
        console.log("[FRIEND_REQUESTS_GET] ", e);
        return new NextResponse("Internal error", { status: 500 });
    }
}