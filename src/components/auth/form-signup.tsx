'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronsRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { signUpAction } from '@/actions/auth.actions'
import OAuthButton from '@/components/auth/OAuth-button'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SignUpBody, SignUpBodyType } from '@/schema/auth.schema'
import { handleErrorApi } from '@/utils/errors'

export default function FormSignUp() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(SignUpBody),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
  const onSubmit = async (data: SignUpBodyType) => {
    //Define a submit handler.
    if (loading) return
    setLoading(true)

    try {
      const result = await signUpAction(data)
      toast.success(result.payload.message)
      router.push('/signin')
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter your name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' placeholder='Enter your password again' />
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
      <OAuthButton desc='Already have an account?' link='/signin' label='Sign In' />
    </div>
  )
}
