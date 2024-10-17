import chalk from 'chalk'
import mongoose from 'mongoose'

import envConfig from '../utils/config.js'

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(envConfig.MONGO_URI)
    console.log(chalk.green(`MongoDB connected: ${connection.connection.host}`))
  } catch (errors) {
    throw new Error(`MongoDB connection failed: ${errors.message}`)
  }
}

export default connectDB
