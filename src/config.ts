import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  DATABASE_URL: z.string()
})

const config = envSchema.safeParse({
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  DATABASE_URL: process.env.DATABASE_URL
})

if (!config.success) {
  console.error(config.error.issues)
  throw new Error('Invalid environment variables')
}

const envConfig = config.data

export default envConfig
