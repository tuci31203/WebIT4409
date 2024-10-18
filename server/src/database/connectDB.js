import mongoose from 'mongoose'

import envConfig from '@/utils/config'

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(envConfig.MONGO_URI)
    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
    throw error
  }
}

export default connectDB
