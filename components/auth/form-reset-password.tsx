'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { StatusCodes } from 'http-status-codes'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { resetPasswordAction } from '@/actions/auth.action'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ResetPasswordBody, ResetPasswordBodyType } from '@/schema/auth.schema'

export default function FormResetPassword() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const form = useForm({
    resolver: zodResolver(ResetPasswordBody),
    defaultValues: {
      password: '',
      passwordConfirmation: ''
    }
  })

  const onSubmit = async (data: ResetPasswordBodyType) => {
    if (loading) return
    setLoading(true)

    try {
      if (token) {
        const result = await resetPasswordAction(token, data)
        if (!result.success) {
          switch (result.statusCode) {
            case StatusCodes.BAD_REQUEST:
              form.setError('password', { message: result?.message })
              return
            default:
              toast.error(result?.message)
              return
          }
        }

        toast.success(result?.message)
        form.reset()
        router.push('/signin')
        router.refresh()
      } else {
        toast.error("Don't have a token")
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type='password' placeholder='Enter your password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='passwordConfirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input {...field} type='password' placeholder='Re-enter your password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='mt-1 w-full'>
            Change password
          </Button>
        </div>
      </form>
    </Form>
  )
}
