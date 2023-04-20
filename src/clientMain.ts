import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import client from './client/client'
import { dbReady } from './db/db'
import processAll from './process/process'

const app = express()
const port = 3000

app.use(express.json())

app.use(cors())
app.get('/', (req, res) => {
  res.send('Tone client API online')
})

app.use('/', client)

export default
  new Promise(async (resolve, reject) => {
    await dbReady()
    await processAll()
    const listenServer = app.listen(port, '0.0.0.0', () => {
      console.log(`Tone client api listening on port ${port}`)
      resolve(listenServer)
    })
  })