import { currentProfile } from "../../../../lib/current-profile"
import prisma from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    {params} : {params: Promise<{memberId: string}>}
) {
    try {
        const profile = await currentProfile();
        if(!profile) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const { role } = await req.json();
        const serverId = searchParams.get("serverId");

        if(!serverId) {
            return new NextResponse("Server ID missing", { status : 400 });
        }
        const { memberId } = await params;
        if(!memberId) {
            return new NextResponse("Member ID missing", { status: 400 });
        }
        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch(err) {
        console.log("MEMBER_ID_PATCH", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}