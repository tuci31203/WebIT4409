import { Server, Member, Profile, Message } from "@prisma/client"
import { Socket } from "net";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io"
import { NextApiResponse } from "next";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {profile: Profile})[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: HttpServer & {
            io: SocketIOServer;
        };
    };
};

export type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}