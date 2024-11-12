import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
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
        const { name, image } = await req.json();
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                name,
                image
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

        const server = await db.server.delete({
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