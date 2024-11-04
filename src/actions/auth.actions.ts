import { SignInBodyType, SignInResponseType, SignUpBodyType, SignUpResponseType } from '@/schema/auth.schema'
import http from '@/utils/http'

export const signUpAction = (data: SignUpBodyType) => http.post<SignUpResponseType>('/api/auth/signup', data)
export const signInAction = (data: SignInBodyType) => http.post<SignInResponseType>('/api/auth/signin', data)
