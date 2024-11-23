import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const user = await currentProfile()
    const { serverId } = await params

    if (!user) {
      return new NextResponse('Unathorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: {
          not: user.id
        },
        members: {
          some: {
            userId: user.id
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            userId: user.id
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVER_ID_LEAVE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
