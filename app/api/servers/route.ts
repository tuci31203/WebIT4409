import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

export async function POST(req: Request) {
  const user = await currentProfile()
  try {
    const { name, image } = await req.json()
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const server = await db.server.create({
      data: {
        userId: user.id,
        name,
        image,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', userId: user.id }]
        },
        members: {
          create: [{ userId: user.id, role: MemberRole.ADMIN }]
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVERS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
