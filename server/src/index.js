import express, { json } from 'express'

import connectDB from '@/database/connectDB'
import authRoute from '@/routes/auth.route'
import envConfig, { API_URL } from '@/utils/config'

const app = express()

app.use(json())

// Routes
app.use('/api/auth', authRoute)

const startServer = async () => {
  try {
    await connectDB()
    await app.listen(envConfig.PORT)
    console.log(`Server is running on ${API_URL}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

startServer()
