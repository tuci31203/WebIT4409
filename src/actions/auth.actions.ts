import { SignUpBodyType, SignUpResponseType } from '@/schema/auth.schema'
import http from '@/utils/http'

export const signUpAction = (data: SignUpBodyType) => http.post<SignUpResponseType>('/api/auth/signup', data)
