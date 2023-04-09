import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import db, { dbReady } from './db/db'
import server from './server/server'

const app = express()
const port = 3001

app.use(express.json())

app.use(cors())
app.get('/', (req, res) => {
  res.send('Tone server API online')
})

app.use('/', server)

export default new Promise((resolve, reject) => {
  dbReady().then((e) => {
    const listenServer = app.listen(port, '0.0.0.0', () => {
      console.log(`Tone server api listening on port ${port}`)
      resolve(listenServer)
    })
  })
})
