import z from 'zod'

export const UpdateUserProfileSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name is required'
    })
    .optional(),
  image: z.string().optional(),
  isTwoFactorEnabled: z.boolean().optional()
})

export type UpdateUserProfileSchemaType = z.infer<typeof UpdateUserProfileSchema>

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: 'Current password is required'
    }),
    newPassword: z.string().min(6, {
      message: 'New password must be at least 6 characters long'
    }),
    confirmPassword: z.string().min(6, {
      message: 'New password must be at least 6 characters long'
    })
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Oops! Your passwords don't match. Please try again",
    path: ['confirmPassword']
  })

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>
