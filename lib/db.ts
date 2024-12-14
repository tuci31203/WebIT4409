import { PrismaClient } from '@prisma/client'

import envConfig from '@/config/env.config'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const db = globalThis.prismaGlobal ?? prismaClientSingleton()

export default db

if (envConfig.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db
}
