import db from '@/lib/db'
import { generateRandomImage, hashPassword } from '@/utils/crypto'

type User = {
  email: string
  password: string
  name: string
}

export const createUser = async (data: User) => {
  const { email, password, name } = data

  const hashedPassword = await hashPassword(password)
  const image = generateRandomImage(name)
  return db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image
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
    return await db.user.findUnique({
      where: { email }
    })
  } catch {
    return null
  }
}

export const findUserById = async (id: string | undefined) => {
  try {
    return await db.user.findUnique({
      where: { id }
    })
  } catch {
    return null
  }
}
