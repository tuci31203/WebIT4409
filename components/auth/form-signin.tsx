'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { StatusCodes } from 'http-status-codes'
import { ChevronsRight, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { resendOTPAction, signInAction } from '@/actions/auth.action'
import OAuthButton from '@/components/auth/OAuth-button'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { getQueryParams } from '@/lib/utils'
import { SignInBody, SignInBodyType } from '@/schema/auth.schema'

export default function FormSignIn() {
  const [loading, setLoading] = useState(false)
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [currentEmail, setCurrentEmail] = useState('')
  const router = useRouter()
  const errorParam = getQueryParams('error')
  const form = useForm({
    resolver: zodResolver(SignInBody),
    defaultValues: {
      email: '',
      password: ''
    } as SignInBodyType
  })

  useEffect(() => {
    let timerId: NodeJS.Timeout
    if (showTwoFactorAuth && countdown > 0) {
      timerId = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timerId)
            setCanResend(true)
            return 0
          }
          return prevCountdown - 1
        })
      }, 1000)
    }

    return () => {
      if (timerId) clearInterval(timerId)
    }
  }, [showTwoFactorAuth, countdown])

  useEffect(() => {
    if (errorParam === 'OAuthAccountNotLinked') {
      const errorOAuthMessage =
        'You previously signed up using your email and password. Please log in using the same credentials.'
      form.setError('email', { message: errorOAuthMessage })
      form.setError('password', { message: errorOAuthMessage })
    }
  }, [errorParam, form])

  const onSubmit = async (data: SignInBodyType) => {
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

      if (result?.showTwoFactorAuth) {
        setShowTwoFactorAuth(true)
        setCountdown(60)
        setCanResend(false)
        setCurrentEmail(data.email)
      } else {
        form.reset()
        router.push('/')
        router.refresh()
      }

      toast.success(result?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return
    setLoading(true)

    try {
      const result = await resendOTPAction(currentEmail)
      if (result?.success) {
        toast.success(result?.message)
        setCountdown(60)
        setCanResend(false)
        form.setValue('codeOTP', '')
      } else {
        toast.error(result?.message || 'Failed to resend OTP')
      }
    } catch (error) {
      toast.error('An error occurred while resending OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid gap-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            {showTwoFactorAuth && (
              <FormField
                control={form.control}
                name='codeOTP'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='mb-4 flex justify-center'>Authenticate Your Account</FormLabel>
                    <FormControl>
                      <div className='flex items-center justify-center'>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormDescription className='text-center'>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <div className='mt-2 flex items-center justify-center'>
                      {countdown > 0 ? (
                        <p className='text-center text-xs text-muted-foreground'>
                          Didn&apos;t receive the code? You can resend the OTP in {countdown} seconds.
                        </p>
                      ) : (
                        <Button
                          type='button'
                          variant='ghost'
                          onClick={handleResendOTP}
                          disabled={loading || !canResend}
                          className='flex items-center'
                        >
                          <RefreshCcw className='mr-2 h-4 w-4' />
                          Resend OTP
                        </Button>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactorAuth && (
              <>
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
              </>
            )}
            <Button type='submit' className='mt-1 w-full' disabled={loading}>
              {showTwoFactorAuth ? 'Confirm' : 'Continue'}
              <ChevronsRight />
            </Button>
          </div>
        </form>
      </Form>
      <OAuthButton desc="Don't have an account?" link='/signup' label='Sign Up' />
    </div>
  )
}
