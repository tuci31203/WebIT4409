'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { changeProfileAction } from '@/actions/user.action'
import FormChangePassword from '@/components/auth/form-change-password'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import useCurrentUser from '@/hooks/use-current-user'
import { UpdateUserProfileSchema, UpdateUserProfileSchemaType } from '@/schema/user.schema'

export default function UserSecurity() {
  const { data, update } = useCurrentUser()
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: {
      isTwoFactorEnabled: data?.user?.isTwoFactorEnabled as boolean
    } as UpdateUserProfileSchemaType
  })
  const onSubmit = async (data: UpdateUserProfileSchemaType) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const result = await changeProfileAction(data)
      await update({ isTwoFactorEnabled: data.isTwoFactorEnabled })
      if (!result?.success) {
        toast.error(result?.message)
        return
      }
      toast.success('Two factor authentication updated successfully')
      router.refresh()
    } catch (errors) {
      console.log(errors)
      toast.error('Failed to update two factor authentication')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className='mb-3 text-xl font-bold'>User details</p>
      {data?.user?.isOAuth && (
        <div className='pb-4 text-xs font-bold text-destructive'>
          You are logged in using {data?.user.provider} account. Password and 2FA settings cannot be changed.
        </div>
      )}
      <Separator />
      <div className='my-3 flex min-w-0 items-center justify-between gap-6'>
        <p className='w-64 text-sm'>Security</p>
        {!isUpdate && (
          <Button variant='ghost' className='pl-1 text-muted-foreground' size='sm' onClick={() => setIsUpdate(true)}>
            Set password
          </Button>
        )}
        {isUpdate && (
          <Card className='flex-1'>
            <CardHeader className='p-4 pb-2'>
              <CardTitle className='pl-1 text-sm'>Update profile</CardTitle>
            </CardHeader>
            <CardContent className='px-5 py-0'>
              <FormChangePassword setIsUpdate={setIsUpdate} isOAuth={data?.user?.isOAuth} />
            </CardContent>
          </Card>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='isTwoFactorEnabled'
            render={({ field }) => (
              <FormItem className='my-3 flex items-center justify-between gap-6'>
                <div className='space-y-0.5'>
                  <FormLabel>
                    2FA
                    {data?.user?.isTwoFactorEnabled && (
                      <Badge variant='success' className='ml-1'>
                        Enabled
                      </Badge>
                    )}
                    {!data?.user?.isTwoFactorEnabled && (
                      <Badge variant='destructive' className='ml-1'>
                        Disabled
                      </Badge>
                    )}
                  </FormLabel>
                  <FormDescription>
                    Add an extra layer of security by requiring a verification code at login.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={data?.user.isOAuth} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2 py-4 pb-5'>
            <Button size='sm' variant='primary' type='submit'>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
