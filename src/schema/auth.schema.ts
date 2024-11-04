import z from 'zod'

export const SignUpBody = z
  .object({
    name: z.string().min(1, {
      message: 'Name is not be empty'
    }),
    email: z.string().email({
      message: 'Invalid email address'
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long'
    }),
    confirmPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters long'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Oops! Your passwords don't match. Please try again",
    path: ['confirmPassword']
  })

export type SignUpBodyType = z.infer<typeof SignUpBody>

export const SignUpResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string()
  })
})

export type SignUpResponseType = z.infer<typeof SignUpResponse>

export const SignInBody = z.object({
  email: z.string().email({
    message: 'Invalid email address'
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long'
  })
})

export type SignInBodyType = z.infer<typeof SignInBody>

export const SignInResponse = SignUpResponse

export type SignInResponseType = z.infer<typeof SignInResponse>
