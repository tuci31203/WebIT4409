import { currentProfile } from "../../../lib/current-profile";
import prisma from "../../../lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4} from "uuid"

export async function POST(req: Request) {
    const profile = await currentProfile();
    try {
        const { name, imageUrl } = await req.json()
        if(!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        const server = await prisma.server.create({
            data: {
                profileId: profile.id,
                name, 
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        });

        return NextResponse.json(server);
    } catch(error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal error", {status: 500})
    }
}