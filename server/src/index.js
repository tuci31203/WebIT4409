import express, { json } from 'express'

import connectDB from '@/database/connectDB.js'
import authRoute from '@/routes/auth.route.js'
import envConfig, { API_URL } from '@/utils/config.js'

const app = express()

app.use(json())

// Routes
app.use('/api/auth', authRoute)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(envConfig.PORT, () => {
      console.log(`Server is running on: ${API_URL}`)
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

startServer()
