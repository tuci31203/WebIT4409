import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO, ServerOptions } from 'socket.io'

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

    io.on('connection', socket => {
      socket.on('emoji-effect', (emoji: string) => {
        io.emit('emoji-effect', emoji)
      })
    })
  }

  res.end()
}

export default ioHandler
