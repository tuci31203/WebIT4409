'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import FormChangePassword from '@/components/auth/form-change-password'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { TwoFactorAuthSchema, TwoFactorAuthSchemaType } from '@/schema/user.schema'

export default function UserSecurity() {
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(TwoFactorAuthSchema),
    defaultValues: {
      twoFactorAuth: false
    }
  })

  const onSubmit = async (data: TwoFactorAuthSchemaType) => {
    if (isLoading) return
    setIsLoading(true)

    try {
    } catch (errors) {
      console.log(errors)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className='mb-3 text-xl font-bold'>Profile details</p>
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
              <FormChangePassword setIsUpdate={setIsUpdate} />
            </CardContent>
          </Card>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='twoFactorAuth'
            render={({ field }) => (
              <FormItem className='my-3 flex items-center justify-between gap-6'>
                <div className='space-y-0.5'>
                  <FormLabel>2FA</FormLabel>
                  <FormDescription>
                    Add an extra layer of security by requiring a verification code at login.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
