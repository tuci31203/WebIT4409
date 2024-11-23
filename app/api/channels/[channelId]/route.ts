import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const user = await currentProfile()
    const { channelId } = await params
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!channelId) {
      return new NextResponse('Channel ID missing', { status: 400 })
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
          delete: {
            id: channelId,
            name: {
              not: 'general'
            }
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (e) {
    console.log('[CHANNEL_ID_DELETE', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const user = await currentProfile()

    const { channelId } = await params
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const { name, type } = await req.json()
    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!channelId) {
      return new NextResponse('Channel ID missing', { status: 400 })
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
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general'
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (e) {
    console.log('[CHANNEL_ID_PATCH', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}
