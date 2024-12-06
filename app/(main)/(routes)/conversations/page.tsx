import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-user-profile'
import db from '@/lib/db'

const InitialConversationPage = async () => {
  const profile = await currentProfile()

  if (!profile) {
    redirect('/sign-in') // Redirects server-side to the sign-in page
    return null
  }

  const conversations = await db.conversation1.findMany({
    where: {
      OR: [{ profileOneId: profile.id }, { profileTwoId: profile.id }]
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })
  if (!conversations || conversations.length === 0) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Create a new conversation</p>
      </div>
    )
  }
  const otherUserId =
    conversations[0].profileOneId === profile.id ? conversations[0].profileTwoId : conversations[0].profileOneId
  return redirect(`/conversations/${otherUserId}`)
}

export default InitialConversationPage
