'use server'
import { StatusCodes } from 'http-status-codes'
import { AuthError } from 'next-auth'

import { PrismaErrorCode } from '@/constants/error-reference'
import { signIn, signOut } from '@/lib/auth'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail'
import prisma from '@/lib/prisma'
import { createPasswordResetToken, createVerificationToken } from '@/lib/tokens'
import { ForgotPasswordBodyType, ResetPasswordBodyType, SignInBodyType, SignUpBodyType } from '@/schema/auth.schema'
import { getPasswordResetTokenByToken, getVerificationTokenByToken } from '@/service/tokens.service'
import { createUser, findUserByEmail } from '@/service/user.service'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { isPrismaClientKnownRequestError } from '@/utils/errors'

export const signUpAction = async (data: SignUpBodyType) => {
  const { name, email, password } = data

  try {
    await createUser({ name, email, password })
    const verificationToken = await createVerificationToken(email)
    if (verificationToken) {
      await sendVerificationEmail(email, verificationToken.token)
    }

    return {
      success: true,
      message: 'Verification email sent'
    }
  } catch (errors) {
    if (isPrismaClientKnownRequestError(errors) && errors.code === PrismaErrorCode.UniqueConstraintViolation) {
      return {
        success: false,
        message: 'Email already exists',
        statusCode: StatusCodes.CONFLICT
      }
    }

    return {
      success: false,
      message: 'Internal Server Error'
    }
  }
}

export const signInAction = async (data: SignInBodyType) => {
  try {
    await signIn('credentials', {
      ...data,
      redirect: false
    })

    const existingUser = await findUserByEmail(data.email)
    if (existingUser && !existingUser.emailVerified) {
      const verificationToken = await createVerificationToken(existingUser.email)
      if (verificationToken) {
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
      }
      return {
        success: true,
        message: 'Please verify your email address'
      }
    }
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
        case 'CallbackRouteError':
          return {
            success: false,
            message: 'You have signed up using a social account. Please sign in using the same method.',
            statusCode: StatusCodes.BAD_REQUEST
          }
        case 'OAuthAccountNotLinked': {
          return {
            success: false,
            message:
              'You previously signed up using your email and password. Please log in using the same credentials.',
            statusCode: StatusCodes.BAD_REQUEST
          }
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

export const signOutAction = async () => {
  try {
    await signOut({ redirect: false })
  } catch (errors) {
    console.log(errors)
  }
}

export const verifyEmailAction = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return {
      success: false,
      message: 'The access invalid token'
    }
  }

  const hasExpired = new Date() > new Date(existingToken.expires)

  if (hasExpired) {
    return {
      success: false,
      message: 'Token has expired'
    }
  }

  const existingUser = await findUserByEmail(existingToken.email)
  if (!existingUser) {
    return {
      success: false,
      message: 'Email does not exist'
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email
      }
    })

    await prisma.verificationToken.delete({
      where: {
        email_token: {
          email: existingToken.email,
          token
        }
      }
    })

    return {
      success: true,
      message: 'Email verified successfully'
    }
  } catch (errors) {
    return {
      success: false,
      message: 'Failed to update email verification in database'
    }
  }
}

export const forgotPasswordAction = async (data: ForgotPasswordBodyType) => {
  const existingUser = await findUserByEmail(data.email)

  if (!existingUser) {
    return {
      success: false,
      message: 'Email not found'
    }
  }

  const passwordResetToken = await createPasswordResetToken(data.email)
  if (passwordResetToken) {
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)
  }

  return {
    success: true,
    message: 'Password reset email sent. Check your inbox.'
  }
}

export const resetPasswordAction = async (token: string, data: ResetPasswordBodyType) => {
  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return {
      success: false,
      message: 'The access invalid token'
    }
  }

  const hasExpired = new Date() > new Date(existingToken.expires)
  if (hasExpired) {
    return {
      success: false,
      message: 'Token has expired'
    }
  }
  const existingUser = await findUserByEmail(existingToken.email)
  if (!existingUser) {
    return {
      success: false,
      message: 'Email does not exist',
      statusCode: StatusCodes.BAD_REQUEST
    }
  }
  if (existingUser.password) {
    const isCurrentPasswordSameAsNew = await comparePassword(data.password, existingUser.password)
    if (isCurrentPasswordSameAsNew) {
      return {
        success: false,
        message: 'The new password cannot be the same as the current password',
        statusCode: StatusCodes.BAD_REQUEST
      }
    }
  }
  const hashedPassword = await hashPassword(data.password)

  try {
    await prisma.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        password: hashedPassword
      }
    })

    await prisma.passwordResetToken.delete({
      where: {
        email_token: {
          email: existingToken.email,
          token
        }
      }
    })

    return {
      success: true,
      message: 'Password reset successfully'
    }
  } catch (errors) {
    return {
      success: false,
      message: 'Failed to update password in database'
    }
  }
}
