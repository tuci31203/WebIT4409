import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

interface ServerIdPageProps {
  params: {
    serverId: string
  }
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const user = await currentProfile()
  const { serverId } = await params

  if (!user) {
    redirect('/sign-in') // Redirects server-side to the sign-in page
    return null
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return null
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage
