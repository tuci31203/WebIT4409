import { CircleUserRound, Settings, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserProfile from '@/components/user/user-profile'
import UserSecurity from '@/components/user/user-security'

export default function AccountManagementModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='h-auto w-full justify-start p-2 px-2 font-normal hover:bg-muted-foreground/15 focus-visible:ring-0 focus-visible:ring-offset-0'
        >
          <Settings size={17} />
          Manage account
        </Button>
      </DialogTrigger>
      <DialogContent className='h-[500px] p-0 sm:max-w-[1000px]'>
        <Tabs orientation='vertical' className='p-0'>
          <TabsList className='h-full w-64 p-3'>
            <DialogHeader className='pb-4'>
              <DialogTitle className='text-xl font-bold text-black'>Account Settings</DialogTitle>
              <DialogDescription>Manage your account info.</DialogDescription>
            </DialogHeader>
            <TabsTrigger
              value='profile'
              className='inline-flex w-full gap-3 rounded-md bg-transparent px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-muted-foreground/30 data-[state=active]:shadow-sm'
            >
              <CircleUserRound size={20} />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value='security'
              className='inline-flex w-full gap-3 rounded-md bg-transparent px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-muted-foreground/30 data-[state=active]:shadow-sm'
            >
              <ShieldCheck size={20} />
              Security
            </TabsTrigger>
          </TabsList>
          <ScrollArea className='h-[490px] w-full'>
            <TabsContent value='profile' className='w-full px-10 py-3 text-sm text-black'>
              <UserProfile />
            </TabsContent>
            <TabsContent value='security' className='w-full px-10 py-3 text-black'>
              <UserSecurity />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
