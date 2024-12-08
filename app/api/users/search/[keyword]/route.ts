import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-user-profile'
import db from '@/lib/db'

export async function GET(req: Request, { params }: { params: Promise<{ keyword: string }> }) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { keyword } = await params
    if (!keyword) {
      return NextResponse.json([])
    }
    // let queryValue = keyword?.trim().toLowerCase()
    // if (queryValue.length === 0) return NextResponse.json([])
    // queryValue += '%'
    // const users =
    //   await db.$queryRaw`select * from user where id != ${profile.id} and (lower(name) like ${queryValue} or email like ${queryValue})`

    const users = await db.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: keyword,
              mode: 'insensitive'
            }
          }
        ]
      },
      take: 10
    })
    return NextResponse.json(users)
  } catch (err) {
    console.log('[USERS_SEARCH_GET]', err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
