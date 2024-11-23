import { error } from 'console'
import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const user = await currentProfile()
    const { serverId } = await params

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        userId: user.id
      }
    })

    return NextResponse.json(server)
  } catch (e) {
    console.log('[SERVER_ID_DELETE', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const user = await currentProfile()
    const { name, image } = await req.json()
    const { serverId } = await params
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id
      },
      data: {
        name,
        image
      }
    })

    return NextResponse.json(server)
  } catch (e) {
    console.log('[SERVER_ID_PATCH', e)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
