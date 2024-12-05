import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-user-profile'
import db from '@/lib/db'

export async function DELETE(req: Request, { params }: { params: Promise<{ memberId: string }> }) {
  try {
    const user = await currentProfile()
    const { searchParams } = new URL(req.url)
    const { memberId } = await params

    const serverId = searchParams.get('serverId')

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!memberId) {
      return new NextResponse('Member ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            userId: {
              not: user.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            user: true
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[MEMBER_ID_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
export async function PATCH(req: Request, { params }: { params: Promise<{ memberId: string }> }) {
  try {
    const user = await currentProfile()
    const { searchParams } = new URL(req.url)
    const { role } = await req.json()
    const { memberId } = await params

    const serverId = searchParams.get('serverId')

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID Missing', { status: 400 })
    }

    if (!memberId) {
      return new NextResponse('Member ID Missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              userId: {
                not: user.id
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
            user: true
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[MEMBERS_ID_PATCH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
