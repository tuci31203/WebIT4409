import { StatusCodes } from 'http-status-codes'

import prisma from '@/lib/prisma'
import { comparePassword } from '@/utils/crypto'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true
      }
    })

    if (!user) {
      return Response.json(
        {
          message: 'Entity Error',
          errors: [{ field: 'email', message: 'Invalid email address. Please try again' }]
        },
        {
          status: StatusCodes.UNPROCESSABLE_ENTITY
        }
      )
    }

    const isPasswordValid = await comparePassword(password, user.password || '')

    if (!isPasswordValid) {
      return Response.json(
        {
          message: 'Entity Error',
          errors: [{ field: 'password', message: 'Incorrect password. Please try again' }]
        },
        {
          status: StatusCodes.UNPROCESSABLE_ENTITY
        }
      )
    }

    const { password: _, ...data } = user

    return Response.json(
      {
        message: 'Signed in successfully',
        data
      },
      {
        status: StatusCodes.OK
      }
    )
  } catch (errors) {
    return Response.json(
      {
        message: 'Something went wrong'
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR
      }
    )
  }
}
