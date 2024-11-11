import { currentProfile } from "../../../../lib/current-profile";
import prisma from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{serverId: string}> }
) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { serverId } = await params;
        const { name, imageUrl } = await req.json();
        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVERS_DELETE] ", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{serverId: string}> }
) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { serverId } = await params;
        if(!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        const server = await prisma.server.delete({
            where: {
                id: serverId,
                profileId: profile.id
            }
        });
        
        return NextResponse.json(server);

    } catch(err) {
        console.log("SERVER_ID_DELETE ", err);
        return new NextResponse("Internal server", { status: 500 }); 
    }
}