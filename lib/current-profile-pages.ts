import { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/lib/auth'
import { NextApiResponseServerIo } from '@/types'

type ApiRouteType = {
  req: NextApiRequest
  res: NextApiResponseServerIo | NextApiResponse
}
export async function currentProfilePages({ req, res }: ApiRouteType) {
  const session = await auth(req, res)
  if (!session?.user) {
    return null
  }
  return session?.user
}
