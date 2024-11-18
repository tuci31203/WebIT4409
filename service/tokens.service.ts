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

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    return await prisma.passwordResetToken.findFirst({
      where: { token }
    })
  } catch {
    return null
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    return await prisma.passwordResetToken.findFirst({
      where: { email }
    })
  } catch {
    return null
  }
}
