import { useSession } from 'next-auth/react'

export default function UseCurrentUser() {
  const session = useSession()
  return session.data?.user
}
