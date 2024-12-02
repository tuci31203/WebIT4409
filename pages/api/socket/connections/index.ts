import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { ConnectionStatus } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if(req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const profile = await currentProfilePages(req);
        const { requestedProfileId } = req.body;
        if(!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if(!requestedProfileId) {
            return res.status(400).json({ error: "Requested profile ID missing" });
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
        if(connection) {
            if(connection.status === ConnectionStatus.FRIEND) return res.status(400).json({ message: "Friend already"});
            else {
                return res.status(400).json({ message: "Connection already established"});
            }
        }
        connection = await db.connection.create({
            data: {
                profileOneId: profile.id,
                profileTwoId: requestedProfileId,
                status: ConnectionStatus.REQUESTING,
            },
            include: {
                profileOne: true,
                profileTwo: true,
            }
        });

        const connectionKey = `connections:${requestedProfileId}:incoming`;
        res?.socket?.server?.io?.emit(connectionKey, connection);
        
        return res.status(201).json(connection);
    } catch(e) {
        console.log("[CONNECTION_POST] ", e);
        return res.status(500).json({ message: "Internal Error" });
    }
}