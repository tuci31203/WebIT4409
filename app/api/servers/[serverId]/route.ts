import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { error } from "console"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
            }
        })

        return NextResponse.json(server)

    } catch (e) {
        console.log("[SERVER_ID_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile()
        const { name, image } = await req.json()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                image,
            }
        })

        return NextResponse.json(server)

    } catch (e) {
        console.log("[SERVER_ID_PATCH", e)
        return new NextResponse("Internal Error", { status: 500 })
    }
}