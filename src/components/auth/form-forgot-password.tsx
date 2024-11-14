'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronsRight } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { forgotPasswordAction } from '@/actions/auth.action'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ForgotPasswordBody, ForgotPasswordBodyType } from '@/schema/auth.schema'

export default function FormForgotPassword() {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(ForgotPasswordBody),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotPasswordBodyType) => {
    if (loading) return
    setLoading(true)

    try {
      const result = await forgotPasswordAction(data)

      if (!result?.success) {
        toast.error(result?.message)
        return
      }

      toast.success(result?.message)
      form.reset()
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
          <Button type='submit' className='mt-1 w-full' disabled={loading}>
            Send reset link <ChevronsRight />
          </Button>
        </div>
      </form>
    </Form>
  )
}
