import { StatusCodes } from 'http-status-codes'

import { EntityError, EntityErrorPayload } from '@/utils/errors'

type Options = Omit<RequestInit, 'method'> & {
  baseUrl?: string
}

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: Options | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders = {
    'Content-Type': 'application/json'
  }

  const response = await fetch(url, {
    method,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body
  })

  const payload = await response.json()

  const data = {
    status: response.status,
    payload: payload as Response
  }

  if (!response.ok) {
    if (data.status === StatusCodes.UNPROCESSABLE_ENTITY) {
      throw new EntityError(
        data as {
          status: StatusCodes.UNPROCESSABLE_ENTITY
          payload: EntityErrorPayload
        }
      )
    }
  }

  return data
}

const http = {
  get<Response>(url: string, options?: Omit<Options, 'body'> | undefined) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<Options, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<Options, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<Options, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options })
  }
}

export default http
