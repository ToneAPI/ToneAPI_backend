import * as dotenv from 'dotenv'
dotenv.config()
import { dbReady } from './db/db'
import { cacheReady } from './cache/redis'
import processAll from './client/process'

dbReady().then((e) => {
  cacheReady().then((e) => {
    processAll()
  })
})
