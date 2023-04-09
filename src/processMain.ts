import * as dotenv from 'dotenv'
dotenv.config()
import { dbReady } from './db/db'
import { cacheReady } from './cache/redis'
import processAll from './process/process'
import listenKills from "./process/onKill"

async function startup() {
  await dbReady()
  await cacheReady()
  await listenKills()
  await processAll()
}
export default startup()