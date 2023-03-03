import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import client from './client'
import { dbReady } from './db/db'
import server from './server'

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/v1/', server)
app.use('/v1/', client)

dbReady().then((e) => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})
