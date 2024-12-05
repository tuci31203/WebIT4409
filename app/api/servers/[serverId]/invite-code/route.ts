import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: Promise<{ serverId: string }> }) {
  try {
    const user = await currentProfile()
    const { serverId } = await params

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID Missing', { status: 400 })
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id
      },
      data: {
        inviteCode: uuidv4()
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVER_ID]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
