import { Member, Message, Server, User } from '@prisma/client'
import { Server as HttpServer } from 'http'
import { Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { user: User })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: HttpServer & {
      io: SocketIOServer
    }
  }
}

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: User
  }
}
