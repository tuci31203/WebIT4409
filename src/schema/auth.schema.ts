import z from 'zod'

export const SignUpBody = z
  .object({
    username: z.string().min(3, {
      message: 'Username must be at least 3 characters long'
    }),
    email: z.string().email({
      message: 'Invalid email address'
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long'
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters long'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Oops! Your passwords don't match. Please try again",
    path: ['confirmPassword']
  })

export type SignUpBodyType = z.infer<typeof SignUpBody>

export const SignInBody = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  })
})

export type SignInBodyType = z.infer<typeof SignInBody>
