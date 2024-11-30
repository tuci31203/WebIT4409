import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ConnectionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ connectionId: string }> }
) {
    try {
        const profile = await currentProfile();
        const { connectionId } = await params;
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!connectionId) {
            return new NextResponse("Connection ID missing", { status: 400 });
        }
        let connection = await db.connection.findFirst({
            where: {
                id: connectionId,
            }
        });
        if (!connection) {
            return new NextResponse("Connection not found", { status: 400 });
        }
        if (connection.profileTwoId !== profile.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        connection = await db.connection.update({
            where: {
                id: connectionId,
                profileTwoId: profile.id
            },
            data: {
                status: ConnectionStatus.FRIEND
            },
            include: {
                profileOne: true,
                profileTwo: true,
            }
        });
        return NextResponse.json(connection);
    } catch (e) {
        console.log("[CONNECTION_ID_PATCH] ", e);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ connectionId: string }> }
) {
    try {
        const profile = await currentProfile();
        const { connectionId } = await params;
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!connectionId) {
            return new NextResponse("Connection ID missing", { status: 400 });
        }
        let connection = await db.connection.findFirst({
            where: {
                id: connectionId,
            }
        });
        if (!connection) {
            return new NextResponse("Connection not found", { status: 400 });
        }
        if (connection.profileOneId !== profile.id && connection.profileTwoId !== profile.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        connection = await db.connection.delete({
            where: {
                id: connectionId,
            },
            include: {
                profileOne: true,
                profileTwo: true,
            }
        });
        return NextResponse.json(connection);
    } catch (e) {
        console.log("[CONNECTION_ID_DELETE] ", e);
        return new NextResponse("Internal error", { status: 500 });
    }
}