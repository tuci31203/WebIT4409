import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { changePasswordAction } from '@/actions/user.action'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ChangePasswordSchema, ChangePasswordSchemaType } from '@/schema/user.schema'

export default function FormChangePassword({ setIsUpdate }: { setIsUpdate: (value: boolean) => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })
  const onSubmit = async (data: ChangePasswordSchemaType) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const result = await changePasswordAction(data)
      if (!result.success) {
        toast.error(result?.message)
        return
      }
      toast.success(result?.message)
      form.reset()
      router.refresh()
    } catch (errors) {
      console.log(errors)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-1'>
          <FormField
            control={form.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs'>Current Password</FormLabel>
                <FormControl>
                  <Input {...field} type='password' className='h-8 px-2 text-xs' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs'>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type='password' className='h-8 px-2 text-xs' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs'>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type='password' className='h-8 px-2 text-xs' />
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
        </div>
      </form>
    </Form>
  )
}
