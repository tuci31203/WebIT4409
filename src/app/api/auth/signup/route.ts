import { StatusCodes } from 'http-status-codes'

import { PrismaErrorCode } from '@/constants/error-reference'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/utils/crypto'
import { isPrismaClientKnownRequestError } from '@/utils/errors'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  const hashedPassword = await hashPassword(password)

  try {
    const user = await prisma.user.create({
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
    return Response.json(
      {
        message: 'User created successfully',
        data: user
      },
      {
        status: StatusCodes.CREATED
      }
    )
  } catch (errors) {
    if (isPrismaClientKnownRequestError(errors) && errors.code === PrismaErrorCode.UniqueConstraintViolation) {
      return Response.json(
        {
          message: 'Entity Error',
          errors: [{ field: 'email', message: 'Email already exists' }]
        },
        {
          status: StatusCodes.UNPROCESSABLE_ENTITY
        }
      )
    }

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
