// Typed routes from https://urosstok.com/blog/typed-routes-in-express

import * as dotenv from 'dotenv'
import express, { type ErrorRequestHandler } from 'express'
import cors from 'cors'
import { dbReady } from './db'
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
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).send({ error: [{ msg: 'Internal Error! You\'d better report this' }] })
  console.error(err)
}
app.use(errorHandler)

export default new Promise((resolve, reject) => {
  void dbReady().then((e) => {
    const listenServer = app.listen(port, '0.0.0.0', () => {
      console.log(`Tone server api listening on port ${port}`)
      resolve(listenServer)
    })
  })
})
