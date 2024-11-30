import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ConnectionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const profile = await currentProfile();
        const { requestedProfileId } = await req.json();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!requestedProfileId) {
            return new NextResponse("Requested profile ID missing", { status: 400 });
        }
        let connection = await db.connection.findFirst({
            where: {
                OR: [
                    {
                        profileOneId: profile.id,
                        profileTwoId: requestedProfileId,
                    },
                    {
                        profileOneId: requestedProfileId,
                        profileTwoId: profile.id,
                    },
                ]
            }
        });
        if (connection) {
            if (connection.status === ConnectionStatus.FRIEND) return new NextResponse("Friend already", { status: 400 });
            else {
                return new NextResponse("Connection already established", { status: 400 });
            }
        }
        connection = await db.connection.create({
            data: {
                profileOneId: profile.id,
                profileTwoId: requestedProfileId,
                status: ConnectionStatus.REQUESTING,
            }
        });

        return NextResponse.json(connection, { status: 201 });
    } catch (e) {
        console.log("[CONNECTION_POST] ", e);
        return new NextResponse("Internal error", { status: 500 });
    }
}