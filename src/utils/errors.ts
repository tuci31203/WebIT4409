import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'

export type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export function isPrismaClientKnownRequestError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError
}

export class EntityError extends Error {
  status: StatusCodes.UNPROCESSABLE_ENTITY
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: StatusCodes.UNPROCESSABLE_ENTITY; payload: EntityErrorPayload }) {
    super('Entity Error')
    this.status = status
    this.payload = payload
  }
}

export const isEntityError = (error: any) => error instanceof EntityError

export const handleErrorApi = ({ error, setError }: { error: any; setError?: UseFormSetError<any> }) => {
  if (isEntityError(error) && setError) {
    error.payload.errors.forEach(item => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error(error?.payload?.message ?? 'Unknown error')
  }
}
