import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import client from './client'
import { dbReady } from './db/db'
import server from './server/server'

const app = express()
const port = 3001

app.use('/', (req, res, next) => {
  console.log(JSON.stringify(req.body))
  next()
})

app.use(express.json())

app.use('/', (req, res, next) => {
  console.log(JSON.stringify(req.body))
  next()
})

app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/v1/', server)
app.use('/v1/', client)

dbReady().then((e) => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
  })
})
