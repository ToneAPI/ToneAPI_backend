import * as dotenv from 'dotenv'
import cluster from 'cluster'
import os from 'os'
import express from 'express'
import cors from 'cors'
import client from './client/client'
import { dbReady } from './db/db'
dotenv.config()

const cCPUs = os.cpus().length

const port = 3000

if (cluster.isPrimary && process.env.ENVIRONMENT !== 'dev') {
  // Create a worker for each CPU
  for (let i = 0; i < cCPUs; i++) {
    cluster.fork()
  }
  cluster.on('online', function (worker) {
    console.log(`Worker ${worker.process.pid ?? ''} is online`)
  })
  cluster.on('exit', function (worker, code, signal) {
    console.log(`Worker ${worker.process.pid ?? ''} died`)
  })
}

export default
new Promise((resolve, reject) => {
  void (async () => {
    if (!cluster.isPrimary || process.env.ENVIRONMENT === 'dev') {
      const app = express()
      app.use(express.json())
      app.use(cors({ exposedHeaders: ['X-File-Size', 'Content-Encoding'] }))
      app.get('/', (req, res) => {
        res.send('Tone client API online')
      })

      app.use('/', client)

      await dbReady()
      const listenServer = app.listen(port, '0.0.0.0', () => {
        console.log(`Tone client api listening on port ${port}`)
        resolve(listenServer)
      })
    }
  })()
})
