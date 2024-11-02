import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string()
})

const config = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET
})

if (!config.success) {
  console.error(config.error.issues)
  throw new Error('Invalid environment variables')
}

const envConfig = config.data

export default envConfig
