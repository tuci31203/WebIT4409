import { z } from 'zod'

const envSchema = z.object({
  AUTH_TRUST_HOST: z.string(),
  NODE_ENV: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string(),
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
  SESSION_TOKEN_EXPIRES_IN: z.string(),
  RESEND_EMAIL_API_KEY: z.string()
})

const config = envSchema.safeParse({
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
  SESSION_TOKEN_EXPIRES_IN: process.env.SESSION_TOKEN_EXPIRES_IN,
  RESEND_EMAIL_API_KEY: process.env.RESEND_EMAIL_API_KEY
})

if (!config.success) {
  console.error(config.error.issues)
  throw new Error('Invalid environment variables')
}

const envConfig = config.data

export const BASE_URL = envConfig.NODE_ENV === 'production' ? envConfig.NEXT_PUBLIC_BASE_URL : envConfig.AUTH_TRUST_HOST

export default envConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
