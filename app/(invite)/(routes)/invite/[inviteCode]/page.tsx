import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

interface InviteCodePageProps {
  params: Promise<{
    inviteCode: string
  }>
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const user = await currentProfile()
  const { inviteCode } = await params

  if (!inviteCode) {
    return redirect('/')
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          userId: user?.id
        }
      }
    }
  })

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`)
  }
  const server = await db.server.update({
    where: {
      inviteCode: inviteCode
    },
    data: {
      members: {
        create: [
          {
            userId: user?.id as string
          }
        ]
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return null
}

export default InviteCodePage
