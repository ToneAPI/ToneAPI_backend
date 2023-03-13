import db from '../db/db'
import cache from '../cache/redis'
import { processServerPlayers } from './routes/serverPlayers'
import { processServerWeapons } from './routes/serverWeapons'
import { processPlayerWeapons } from './routes/playerWeapons'
import { processPlayerReport } from './routes/player'

async function processAll() {
  const servers = await db.selectFrom('server').selectAll().execute()
  const promises: Promise<any>[] = []
  servers.forEach((e) => {
    promises.push(processServer(e.id))
  })
  await Promise.all(promises)
  setTimeout(processAll, 60000)
}

async function processServer(server: number) {
  await processServerPlayers(server)
  const promises: Promise<any>[] = []
  promises.push(processServerWeapons(server))
  const players = await cache.SMEMBERS(`servers:${server}:players`)
  players.forEach((player) => {
    promises.push(processPlayer(server, Number(player)))
  })
  await Promise.all(promises)
}

async function processPlayer(server: number, player: number) {
  const promises: Promise<any>[] = []
  promises.push(processPlayerWeapons(server, player))
  promises.push(processPlayerReport(server, player))
}

export default processAll
