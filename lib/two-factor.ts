import { addMilliseconds } from 'date-fns'
import ms from 'ms'

import db from '@/lib/db'
import { getTwoFactorTokenByEmail } from '@/service/two-factor.service'
import { generateRandomOTP } from '@/utils/crypto'

export const generateTwoFactorToken = async (email: string) => {
  const token = generateRandomOTP(email)
  const expires = addMilliseconds(new Date(), ms('5m'))

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        email_token: {
          email,
          token: existingToken.token
        }
      }
    })
  }

  return db.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  })
}
