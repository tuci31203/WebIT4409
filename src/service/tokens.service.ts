import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import { v4 } from 'uuid'

import envConfig from '@/config/env.config'
import prisma from '@/lib/prisma'

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await prisma.verificationToken.findFirst({
      where: { token }
    })
  } catch {
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await prisma.verificationToken.findFirst({
      where: { email }
    })
  } catch {
    return null
  }
}

export const createVerificationToken = async (email: string) => {
  try {
    const token = v4()
    const expires = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN))

    const existingToken = await getVerificationTokenByEmail(email)

    if (existingToken) {
      await prisma.verificationToken.delete({
        where: {
          email_token: {
            email,
            token: existingToken.token
          }
        }
      })
    }

    return await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires
      }
    })
  } catch {
    return null
  }
}
