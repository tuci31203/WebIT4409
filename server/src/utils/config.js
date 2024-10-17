import fs from 'node:fs'
import path from 'node:path'

import { config } from 'dotenv'
import z from 'zod'

config({
  path: '.env'
})

const checkEnvVariables = () => {
  if (!fs.existsSync(path.resolve('.env'))) {
    throw new Error('No .env file found')
  }
}

checkEnvVariables()

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string(),
  PROTOCOL: z.string(),
  DOMAIN: z.string(),
  PRODUCTION: z.enum(['true', 'false']).transform(value => value === 'true'),
  PRODUCTION_URL: z.string()
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Invalid values declared in the .env file')
}

const envConfig = configServer.data
export const API_URL = envConfig.PRODUCTION
  ? envConfig.PRODUCTION_URL
  : `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`
export default envConfig
