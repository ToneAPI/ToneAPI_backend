import * as dotenv from 'dotenv'
dotenv.config()
import { dbReady } from './db/db'
import { cacheReady } from './cache/redis'
import processAll from './client/process'

async function startup() {
  await dbReady()
  await cacheReady()
  await processAll()
}
export default startup()