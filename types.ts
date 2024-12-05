import { Server as NetServer } from "http";
import { Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Connection, Profile } from "@prisma/client";
import { Member, User, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { user: User })[];
}

export type ConnectionWithProfile = Connection & {
    profileOne: User,
    profileTwo: User
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};

