import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-user-profile'
import db from '@/lib/db'

export async function GET(req: Request) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const conversations = await db.conversation1.findMany({
      where: {
        OR: [{ profileOneId: profile.id }, { profileTwoId: profile.id }]
      },
      include: {
        profileOne: true,
        profileTwo: true
      }
    })

    const peopleChattedWith = conversations.map(conversation => {
      if (conversation.profileOneId === profile.id) return conversation.profileTwo
      return conversation.profileOne
    })

    return NextResponse.json(peopleChattedWith)
  } catch (err) {
    console.log('[CONVERSATIONS_PARTNERS_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
