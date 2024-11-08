import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{channelId: string}>}
) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if(!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }
        const { channelId } = await params;
        if(!channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }
        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch(err) {
        console.log("[CHANNEL_ID_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{channelId: string}>}
) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if(!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }
        const { channelId } = await params;
        if(!channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }
        const { name, type } = await req.json();
        if(name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 });
        }
        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.MODERATOR, MemberRole.ADMIN]
                        }
                    }
                },
                channels: {
                    some: {
                        id: channelId
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch(err) {
        console.log("CHANNEL_ID_PATCH", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}