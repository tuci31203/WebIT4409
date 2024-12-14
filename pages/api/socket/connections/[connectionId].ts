import { ConnectionStatus } from '@prisma/client'
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { currentProfilePages } from '@/lib/current-profile-pages'
import db from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const profile = await currentProfilePages({ req, res })
    const { connectionId } = req.query
    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (!connectionId) {
      return res.status(400).json({ error: 'Connection ID missing' })
    }
    let connection = await db.connection.findFirst({
      where: {
        id: connectionId as string
      }
    })
    if (!connection) {
      return res.status(400).json({ error: 'Connection not found' })
    }
    if (req.method === 'PATCH') {
      if (connection.profileTwoId !== profile.id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      connection = await db.connection.update({
        where: {
          id: connectionId as string,
          profileTwoId: profile.id
        },
        data: {
          status: ConnectionStatus.FRIEND
        },
        include: {
          profileOne: true,
          profileTwo: true
        }
      })

      const connectionKey1 = `connections:${connection.profileOneId}:newfriends`
      res?.socket?.server?.io?.emit(connectionKey1, connection)
      const connectionKey2 = `connections:${connection.profileTwoId}:newfriends`
      res?.socket?.server?.io?.emit(connectionKey2, connection)

      return res.status(201).json(connection)
    }

    if (req.method === 'DELETE') {
      if (connection.profileOneId !== profile.id && connection.profileTwoId !== profile.id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      connection = await db.connection.delete({
        where: {
          id: connectionId as string
        },
        include: {
          profileOne: true,
          profileTwo: true
        }
      })
      const connectionKey1 = `connections:${connection.profileOneId}:delete`
      res?.socket?.server?.io?.emit(connectionKey1, connection)
      const connectionKey2 = `connections:${connection.profileTwoId}:delete`
      res?.socket?.server?.io?.emit(connectionKey2, connection)

      return res.status(201).json(connection)
    }
  } catch (e) {
    console.log('[CONNECTION_ID_PATCH] ', e)
    return res.status(500).json({ message: 'Internal Error' })
  }
}
