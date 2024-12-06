import db from './db'

export const getOrCreateConversation = async (profileOneId: string, profileTwoId: string) => {
  let conversation = null
  try {
    conversation = await db.conversation1.findFirst({
      where: {
        OR: [
          {
            profileOneId: profileOneId,
            profileTwoId: profileTwoId
          },
          {
            profileTwoId: profileOneId,
            profileOneId: profileTwoId
          }
        ]
      },
      include: {
        profileOne: true,
        profileTwo: true
      }
    })

    if (!conversation) {
      conversation = await db.conversation1.create({
        data: {
          profileOneId,
          profileTwoId
        },
        include: {
          profileOne: true,
          profileTwo: true
        }
      })
    }

    return conversation
  } catch (err) {
    console.log(err)
    return null
  }
}
