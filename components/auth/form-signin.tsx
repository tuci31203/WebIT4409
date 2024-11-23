'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { StatusCodes } from 'http-status-codes'
import { ChevronsRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const searchParams = useSearchParams()
  const errorParam = searchParams?.get('error')
  const form = useForm({
    resolver: zodResolver(SignInBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (errorParam === 'OAuthAccountNotLinked') {
      const errorOAuthMessage =
        'You previously signed up using your email and password. Please log in using the same credentials.'
      form.setError('email', { message: errorOAuthMessage })
      form.setError('password', { message: errorOAuthMessage })
    }
  }, [errorParam, form])

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
                    <Input
                      {...field}
                      placeholder='Enter your email'
                      onChange={event => {
                        field.onChange(event)
                        form.clearErrors('email')
                      }}
                    />
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
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      href='/forgot-password'
                      className='transiton text-sm text-muted-foreground underline duration-300 ease-in-out hover:text-black'
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      placeholder='Enter your password'
                      onChange={event => {
                        field.onChange(event)
                        form.clearErrors('password')
                      }}
                    />
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
