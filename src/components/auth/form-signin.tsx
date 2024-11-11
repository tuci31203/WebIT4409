'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { StatusCodes } from 'http-status-codes'
import { ChevronsRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { signInAction } from '@/actions/auth.action'
import OAuthButton from '@/components/auth/OAuth-button'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SignInBody, SignInBodyType } from '@/schema/auth.schema'

export default function FormSignIn() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(SignInBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const onSubmit = async (data: SignInBodyType) => {
    //Define a submit handler.
    if (loading) return
    setLoading(true)

    try {
      const result = await signInAction(data)

      if (!result?.success) {
        switch (result?.statusCode) {
          case StatusCodes.UNAUTHORIZED:
            form.setError('email', { message: result?.message })
            form.setError('password', { message: result?.message })
            return
          default:
            toast.error(result?.message)
            return
        }
      }

      toast.success(result?.message)
      form.reset()
      router.push('/dashboard')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='grid gap-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter your email' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type='submit' className='mt-1 w-full' disabled={loading}>
              Continue
              <ChevronsRight />
            </Button>
          </div>
        </form>
      </Form>
      <OAuthButton desc="Don't have an account?" link='/signup' label='Sign Up' />
    </div>
  )
}
