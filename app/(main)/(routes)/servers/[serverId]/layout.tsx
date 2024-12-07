import { redirect } from 'next/navigation'

import ServerSidebar from '@/components/server/server-sidebar'
import { currentProfile } from '@/lib/current-user-profile'
import db from '@/lib/db'

const ServerIdLayout = async ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
  const user = await currentProfile()
  const { serverId } = await params
  if (!user) {
    return redirect('/sign-in')
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id
        }
      }
    }
  })

  if (!server) {
    return redirect('/')
  }

  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex'>
        <ServerSidebar serverId={serverId} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  )
}

export default ServerIdLayout
