import bcrypt from 'bcrypt'

const saltRounds = 10
export const hashPassword = async (password: string) => await bcrypt.hash(password, saltRounds)
