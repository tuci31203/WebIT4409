import z from 'zod'

export const SignUpBody = z
  .object({
    name: z.string().min(1, {
      message: 'Username must be at least 1 characters long'
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

export const SignInBody = z.object({
  email: z.string().email({
    message: 'Invalid email address'
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long'
  })
})

export type SignInBodyType = z.infer<typeof SignInBody>
