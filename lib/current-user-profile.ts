import { auth } from '@/lib/auth'
import db from './db'

export const currentProfile = async () => {
    const session = await auth()
    if (!session?.user) {
        return null
    }
    const profile = await db.user.findUnique({
        where: {
            id: session.user.id
        }
    })

    return profile;
}
