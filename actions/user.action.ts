'use server'
import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'
import { ChangePasswordSchemaType } from '@/schema/user.schema'
import { findUserByEmail } from '@/service/user.service'
import { comparePassword, hashPassword } from '@/utils/crypto'

export const changePasswordAction = async (data: ChangePasswordSchemaType) => {
  const currentUser = await currentProfile()

  if (!currentUser?.email) {
    return {
      success: false,
      message: 'Unauthorized: User not logged in'
    }
  }
  const existingUser = await findUserByEmail(currentUser?.email)

  if (!existingUser) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  const isPasswordMatch = await comparePassword(data.currentPassword, existingUser?.password ?? '')

  if (!isPasswordMatch) {
    return {
      success: false,
      message: 'Current password is incorrect'
    }
  }

  const hashedPassword = await hashPassword(data.newPassword)

  try {
    await db.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        password: hashedPassword
      }
    })
    return {
      success: true,
      message: 'Password updated successfully'
    }
  } catch (errors) {
    return {
      success: false,
      error: 'Failed to update password'
    }
  }
}
