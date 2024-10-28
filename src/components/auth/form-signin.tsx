'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronsRight } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SignInBody, SignInBodyType } from '@/schema/auth.schema'

export default function FormSignIn() {
  const form = useForm({
    resolver: zodResolver(SignInBody),
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const onSubmit = (data: SignInBodyType) => {
    console.log(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter your username' />
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
          <Button type='submit' className='mt-1 w-full'>
            Continue
            <ChevronsRight />
          </Button>
          <div className='text-center text-sm text-muted-foreground'>
            <span>Don&apos;t have an account? </span>
            <Link href='/signup' className='text-primary underline'>
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
