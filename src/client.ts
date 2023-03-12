import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import client from './client/client'
import { dbReady } from './db/db'
import { cacheReady } from './cache/redis'

const app = express()
const port = 3001

app.use(express.json())

app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/v1/client', client)

dbReady().then((e) => {
  cacheReady().then((e) => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
})
