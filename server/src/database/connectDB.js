import chalk from 'chalk'
import mongoose from 'mongoose'

import envConfig from '@/utils/config.js'

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(envConfig.MONGO_URI)
    console.log(chalk.green(`MongoDB connected: ${connection.connection.host}`))
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
