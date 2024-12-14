import ButtonSignOut from '@/components/auth/button-signout'
import AccountManagementModal from '@/components/modals/account-management-modal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import { currentProfile } from '@/lib/current-user-profile'

export default async function UserButton() {
  const user = await currentProfile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar
          name={user?.name as string}
          src={user?.image as string}
          className='cursor-pointer md:h-[48px] md:w-[48px]'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mb-7 p-2' side='right'>
        <div className='mb-2 flex'>
          <UserAvatar name={user?.name as string} src={user?.image as string} />
          <div className='ml-2'>
            <p className='text-sm font-semibold'>{user?.name}</p>
            <p className='text-xs text-neutral-500 dark:text-neutral-400'>{user?.email}</p>
          </div>
        </div>
        <Separator />
        <div className='mt-2'>
          <AccountManagementModal />
          <ButtonSignOut />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
