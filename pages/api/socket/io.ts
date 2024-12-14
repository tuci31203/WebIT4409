import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO, ServerOptions } from 'socket.io'

import db from '@/lib/db'; // Import the database instance
import { NextApiResponseServerIo } from '@/types'

export const config = {
  api: {
    bodyParser: false
  }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, <ServerOptions>{
      path: path,
      cors: {
        origin: [process.env.NEXT_PUBLIC_SITE_URL!, '*'],
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      addTrailingSlash: false
    })
    res.socket.server.io = io

    io.on('connection', async socket => {
      const userId = socket.handshake.query.userId as string
      console.log(userId)
      // Update user status to online
      await db.user.update({
        where: { id: userId },
        data: { isOnline: true }
      })

      socket.on('disconnect', async () => {
        // Update user status to offline and set last online time
        await db.user.update({
          where: { id: userId },
          data: { isOnline: false }
        })
      })

      socket.on('emoji-effect', (emoji: string) => {
        io.emit('emoji-effect', emoji)
      })
    })
  }

  res.end()
}

export default ioHandler
