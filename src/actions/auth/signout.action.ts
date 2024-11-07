'use server'
import { signOut } from '@/lib/auth'

export const signOutAction = async () => {
  try {
    await signOut({ redirect: false })
  } catch (errors) {
    console.log(errors)
  }
}
