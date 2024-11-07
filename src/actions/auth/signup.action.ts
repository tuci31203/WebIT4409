import { SignInResponseType, SignUpBodyType } from '@/schema/auth.schema'
import http from '@/utils/http'

export const signUpAction = async (data: SignUpBodyType) => http.post<SignInResponseType>(`/api/auth/sign-up`, data)
