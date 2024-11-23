import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

export const POST = async (req: Request) => {
  try {
    const user = await currentProfile()
    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get('serverId')
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (name === 'general') {
      return new NextResponse("Name cannot be 'general'", { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            userId: user.id,
            name,
            type
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (e) {
    console.log('CHANNELS_POST', e)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
