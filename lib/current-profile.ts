import { auth } from '@/lib/auth'

export const currentProfile = async () => {
  const session = await auth()
  if (!session?.user) {
    return null
  }
  return session?.user
}
