import { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/lib/auth'
import { NextApiResponseServerIo } from '@/types'
import db from './db'

type ApiRouteType = {
  req: NextApiRequest
  res: NextApiResponseServerIo | NextApiResponse
}
export async function currentProfilePages({ req, res }: ApiRouteType) {
  const session = await auth(req, res)
  if (!session?.user) {
    return null
  }
  const profile = await db.user.findUnique({
    where: {
      id: session.user.id
    }
  })
  return profile
}
