import prisma from '@/lib/prisma'
import { hashPassword } from '@/utils/crypto'

type User = {
  email: string
  password: string
  name: string
}

export const createUser = async (data: User) => {
  const { email, password, name } = data

  const hashedPassword = await hashPassword(password)
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  })
}

export const findUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email }
    })
  } catch {
    return null
  }
}
