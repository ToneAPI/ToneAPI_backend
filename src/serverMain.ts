// Typed routes from https://urosstok.com/blog/typed-routes-in-express



import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { dbReady } from './db/db'
import server from './generated/server'
dotenv.config()

const app = express()
const port = 3001

app.use(express.json())

app.use(cors())
app.get('/', (req, res) => {
  res.send('Tone server API online')
})

app.use('/', server)

export default new Promise((resolve, reject) => {
  void dbReady().then((e) => {
    const listenServer = app.listen(port, '0.0.0.0', () => {
      console.log(`Tone server api listening on port ${port}`)
      resolve(listenServer)
    })
  })
})
