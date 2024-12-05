'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { changeProfileAction } from '@/actions/user.action'
import AvatarUploadButton from '@/components/avatar-upload-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import useCurrentUser from '@/hooks/use-current-user'
import { UpdateUserProfileSchema, UpdateUserProfileSchemaType } from '@/schema/user.schema'

export default function UserProfile() {
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data, update } = useCurrentUser()
  const form = useForm({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: {
      name: data?.user?.name as string
    } as UpdateUserProfileSchemaType
  })

  const onSubmit = async (data: UpdateUserProfileSchemaType) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const result = await changeProfileAction(data)
      await update({ name: data.name })
      if (!result?.success) {
        toast.error(result?.message)
        return
      }

      toast.success(result?.message)
      router.refresh()
    } catch (errors) {
      console.log(errors)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className='mb-3 text-xl font-bold'>User details</p>
      <Separator />
      <div className='my-3 flex min-w-0 items-center justify-start gap-6'>
        <p className='w-64'>User</p>
        {!isUpdate && (
          <div className='flex flex-grow items-center justify-between'>
            <div className='flex items-center gap-6'>
              <UserAvatar src={data?.user?.image as string} name={data?.user?.name as string} />
              <p>{data?.user?.name}</p>
            </div>
            <Button variant='ghost' className='pl-1 text-muted-foreground' size='sm' onClick={() => setIsUpdate(true)}>
              Update profile
            </Button>
          </div>
        )}
        {isUpdate && (
          <Card className='flex-1'>
            <CardHeader className='p-4'>
              <CardTitle className='pl-2'>Update profile</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 px-5 py-0'>
              <div className='flex gap-6'>
                <UserAvatar src={data?.user?.image as string} name={data?.user?.name as string} />
                <div className='space-y-2'>
                  <AvatarUploadButton endpoint='serverImage' />
                  <p className='text-xs text-muted-foreground'>Recommended size 1:1, up to 4MB</p>
                </div>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs'>Name</FormLabel>
                        <FormControl>
                          <Input {...field} className='h-8 px-2 text-xs' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex justify-end gap-2 py-4 pb-5'>
                    <Button type='button' variant='outline' size='sm' onClick={() => setIsUpdate(false)}>
                      Cancel
                    </Button>
                    <Button size='sm' variant='primary' type='submit' disabled={isLoading}>
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
      <Separator />
      <div className='my-3 flex items-center justify-start gap-6'>
        <p className='w-64'>Email address</p>
        <div className='flex items-center gap-6 text-muted-foreground'>
          <p>{data?.user?.email}</p>
          {data?.user?.provider !== 'Credentials' && (
            <Badge variant='info' className='text-xs'>
              {data?.user?.provider} Account
            </Badge>
          )}
          {data?.user?.provider === 'Credentials' && (
            <Badge variant='success' className='text-xs'>
              Verified
            </Badge>
          )}
        </div>
      </div>
    </>
  )
}
