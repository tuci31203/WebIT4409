import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: Promise<{ nameStartWith: string }> }
) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { nameStartWith } = await params;
        if(!nameStartWith) {
            return NextResponse.json([]);
        }
        const profiles = await db.profile.findMany({
            where: {
                name: {
                    startsWith: nameStartWith,
                },
                NOT: {
                    id: profile.id
                }
            }
        });

        return NextResponse.json(profiles);
    } catch(err) {
        console.log("[PROFILES_NAME_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}