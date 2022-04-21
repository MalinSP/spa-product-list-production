import express from 'express'
const app = express()
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import morgan from 'morgan'

import connectDB from './db/connect.js'
import productsRoutes from './routes/productsRoutes.js'

import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname, './client/build')))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(xss())
app.use(mongoSanitize())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome')
})

app.use('/api/v1/', productsRoutes)
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
start()
