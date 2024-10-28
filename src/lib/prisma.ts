import { neonConfig, Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

import envConfig from '@/config'

const prismaClientSingleton = () => {
  neonConfig.webSocketConstructor = ws
  const connectionString = `${envConfig.DATABASE_URL}`

  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (envConfig.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
