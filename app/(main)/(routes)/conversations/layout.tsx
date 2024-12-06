import { redirect } from 'next/navigation'

import ConversationSidebar from '@/components/conversation/conversation-sidebar'
import { currentProfile } from '@/lib/current-user-profile'

const ConversationLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await currentProfile()
  if (!profile) {
    return redirect('/sign-in')
  }

  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex'>
        <ConversationSidebar profile={profile} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  )
}

export default ConversationLayout
