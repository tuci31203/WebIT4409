import bcrypt from 'bcryptjs'
import CryptoJS from 'crypto-js'

import envConfig from '@/config/env.config'

const saltRounds = 10

export const hashPassword = async (password: string) => await bcrypt.hash(password, saltRounds)
export const comparePassword = async (password: string, hash: string | '') => await bcrypt.compare(password, hash)
export const generateRandomOTP = (email: string) => {
  const secret = `${email}-${new Date().toISOString()}-${envConfig.AUTH_SECRET}`
  const hash = CryptoJS.SHA256(secret).toString(CryptoJS.enc.Hex)
  const otp = parseInt(hash.slice(-6), 16) % 1000000

  return otp.toString().padStart(6, '0')
}
export const generateRandomImage = (name: string) => {
  const hashName = CryptoJS.MD5(name).toString()
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${hashName}`
}
