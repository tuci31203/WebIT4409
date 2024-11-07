'use server'
import { StatusCodes } from 'http-status-codes'
import { AuthError } from 'next-auth'

import { signIn } from '@/lib/auth'
import { SignInBodyType } from '@/schema/auth.schema'

export const signInAction = async (data: SignInBodyType) => {
  try {
    await signIn('credentials', {
      ...data,
      redirect: false
    })
    return { success: true, message: 'You have successfully logged into your account.' }
  } catch (errors) {
    if (errors instanceof AuthError) {
      switch (errors.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            message: 'Invalid email or password',
            statusCode: StatusCodes.UNAUTHORIZED
          }
        default:
          return {
            success: false,
            message: 'Oops! Something went wrong',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR
          }
      }
    }
    return {
      success: false,
      message: 'Internal Server Error',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    }
  }
}
