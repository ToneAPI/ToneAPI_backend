import db from '../db/db'
import cache from '../cache/redis'
import { processServerPlayers } from './routes/serverPlayers'
/*import { processPlayerWeapons } from './routes/serverPlayerWeapons'*/
import { processPlayerReport } from './routes/player'
import {
  processWeaponReport,
  populateWeaponSet,
  processWeaponList
} from './process/processWeapon'

/**
 * Starts the process of populating the REDIS database globally
 * @returns
 */
async function processAll() {
  console.log('Starting data calculation...')
  const timeStart = new Date()

  // Iterate through all servers
  const servers = await db.selectFrom('server').selectAll().execute()
  const promises: Promise<any>[] = []
  servers.forEach((server) => {
    promises.push(processServer(server.id))
  })

  //Iterate through all weapons
  await populateWeaponSet()
  const weapons = await cache.SMEMBERS('weapons')
  weapons.forEach((weapon) => {
    promises.push(processWeaponReport(weapon))
  })
  await Promise.all(promises)
  await processWeaponList()

  //TODO : iterate through all players
  console.log(
    'Data calculation finished. Took + ' +
      Math.abs(new Date().getTime() - timeStart.getTime()) / 1000 +
      ' seconds'
  )
  if (process.env.ENVIRONMENT == 'production') {
    return
  }
  setTimeout(processAll, 60000)
}

/**
 * Starts the process of populating the REDIS database for server-related things
 * @param server
 */
async function processServer(server: number) {
  const promises: Promise<any>[] = []
  //TODO TO REMOVE OR RENAME
  await processServerPlayers(server)

  //Iterate through all weapons present on this server
  await populateWeaponSet(server)
  const weapons = await cache.SMEMBERS(`servers:${server}:weapons`)
  weapons.forEach((weapon) => {
    promises.push(processWeaponReport(weapon, server))
  })

  //Iterate through all players present on this server (and do more stuff on those players)
  const players = await cache.SMEMBERS(`servers:${server}:players`)
  players.forEach((player) => {
    promises.push(processPlayer({ server, player: Number(player) }))
  })
  await Promise.all(promises)
  await processWeaponList(server)
}

/**
 * Starts the process of populating the REDIS database for player-related things
 * @param param0
 */
async function processPlayer({
  server,
  player
}: {
  server?: number
  player: number
}) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons`

  const promises: Promise<any>[] = []
  //Iterate through all weapons for this player
  await populateWeaponSet(server, player)
  const weapons = await cache.SMEMBERS(cacheLocation)
  weapons.forEach((weapon) => {
    promises.push(processWeaponReport(weapon, server, player))
  })
  await Promise.all(promises)
  await processWeaponList(server, player)
  //TODO : more data analytics
  /*
  promises.push(processPlayerWeapons(server, player))
  promises.push(processPlayerReport(server, player))*/
  await Promise.all(promises)
}

export default processAll
