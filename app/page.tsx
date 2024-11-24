import { redirect } from 'next/navigation'

import { InitialModal } from '@/components/modals/initial-modal'
import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

export default async function Home() {
  const user = await currentProfile()

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: user?.id
        }
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return (
    <div className='flex justify-between'>
      <InitialModal />
    </div>
  )
}
