'use server'
import { unstable_update } from '@/lib/auth'
import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'
import { ChangePasswordSchemaType, UpdateUserProfileSchemaType } from '@/schema/user.schema'
import { findUserByEmail, findUserById } from '@/service/user.service'
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

export const changeProfileAction = async (data: UpdateUserProfileSchemaType) => {
  const currentUser = await currentProfile()
  const { name, image, isTwoFactorEnabled } = data

  const existingUser = await findUserById(currentUser?.id)

  if (!existingUser) {
    return {
      success: false,
      message: 'Unauthorized: User not found'
    }
  }

  const updateData: Partial<UpdateUserProfileSchemaType> = {}
  if (name !== undefined) updateData.name = name
  if (image !== undefined) updateData.image = image
  if (isTwoFactorEnabled !== undefined) updateData.isTwoFactorEnabled = isTwoFactorEnabled

  try {
    await db.user.update({
      where: {
        id: existingUser?.id
      },
      data: updateData
    })

    await unstable_update({
      user: {
        ...currentUser,
        ...updateData
      }
    })

    return {
      success: true,
      message: 'User profile updated successfully'
    }
  } catch (errors) {
    console.error(errors)
    return {
      success: false,
      error: 'Failed to update profile info'
    }
  }
}
