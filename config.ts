import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string()
})

const config = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL
})

if (!config.success) {
  console.error(config.error.issues)
  throw new Error('Invalid environment variables')
}

const envConfig = config.data

export default envConfig
