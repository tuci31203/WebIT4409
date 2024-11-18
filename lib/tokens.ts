import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import { v4 } from 'uuid'

import envConfig from '@/config/env.config'
import db from '@/lib/db'
import { getPasswordResetTokenByEmail, getVerificationTokenByEmail } from '@/service/tokens.service'

export const createVerificationToken = async (email: string) => {
  try {
    const token = v4()
    const expires = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN))

    const existingToken = await getVerificationTokenByEmail(email)

    if (existingToken) {
      await db.verificationToken.delete({
        where: {
          email_token: {
            email,
            token: existingToken.token
          }
        }
      })
    }

    return await db.verificationToken.create({
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

export const createPasswordResetToken = async (email: string) => {
  try {
    const token = v4()
    const expires = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN))

    const existingToken = await getPasswordResetTokenByEmail(email)

    if (existingToken) {
      await db.passwordResetToken.delete({
        where: {
          email_token: {
            email,
            token: existingToken.token
          }
        }
      })
    }

    return await db.passwordResetToken.create({
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
