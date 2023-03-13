import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import client from './client/client'
import { dbReady } from './db/db'
import { cacheReady } from './cache/redis'
import processAll from './client/process'

const app = express()
const port = 3001

app.use(express.json())

app.use(cors())
app.get('/', (req, res) => {
  res.send('Tone client API online')
})

app.use('/', client)

dbReady().then((e) => {
  cacheReady().then((e) => {
    processAll().then((e) => {
      app.listen(port, '0.0.0.0', () => {
        console.log(`Example app listening on port ${port}`)
      })
    })
  })
})
