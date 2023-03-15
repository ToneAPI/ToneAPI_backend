import db from '../db/db'
import {
  processWeaponReport,
  populateWeaponSet,
  processWeaponList
} from './process/processWeapon'
import {
  populatePlayerSet,
  processPlayerList,
  processPlayerReport
} from './process/processPlayer'
import { getWeaponSet, getPlayerSet } from '../cache/cacheUtils'

/**
 * Starts the process of populating the REDIS database globally
 * @returns
 */
async function processAll() {
  console.log('Starting data calculation...')
  const timeStart = new Date()
  // Iterate through all servers
  const servers = await db.selectFrom('server').selectAll().execute()
  await populateAllSets()
  const promises: Promise<any>[] = []
  servers.forEach((server) => {
    promises.push(processServer(server.id))
  })
  //Iterate through all weapons
  const weapons = await getWeaponSet()
  weapons.forEach((weapon) => {
    promises.push(processWeapon(weapon))
  })
  //Iterate through all players

  const players = await getPlayerSet()
  players.forEach((player) => {
    promises.push(processPlayer(player))
  })

  await Promise.all(promises)
  //Generate lists now that we have all data
  await processAllLists()

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
 * Populte redis of server lists and reports
 * @param server
 */
async function processServer(server: number) {
  /*const promises: Promise<any>[] = []
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
    promises.push(processPlayer({ server, player }))
  })
  await Promise.all(promises)
  await processWeaponList(server)*/
}

/**
 * Populate redis of player lists and reports
 * @param param0
 */
async function processPlayer(player: string) {
  const promises: Promise<any>[] = []
  //iterate through all servers
  const servers = await db.selectFrom('server').selectAll().execute()
  servers.forEach((server) => {
    promises.push(
      processPlayerReport(player, server.id),
      //Iterate through all players on servers
      getWeaponSet(server.id, player).then((weapons) => {
        weapons.forEach((weapon) => {
          promises.push(processPlayerReport(player, server.id, weapon))
        })
      })
    )
  })
  //iterate through all weapons outside of servers
  const weapons = await getWeaponSet(undefined, player)
  weapons.forEach((weapon) => {
    promises.push(processPlayerReport(player, undefined, weapon))
  })
  //global weapon data
  promises.push(processPlayerReport(player))
  await Promise.all(promises)
}

async function processWeapon(weapon: string) {
  const promises: Promise<any>[] = []
  //iterate through all servers
  const servers = await db.selectFrom('server').selectAll().execute()
  servers.forEach((server) => {
    promises.push(
      processWeaponReport(weapon, server.id),
      //Iterate through all players on servers
      getPlayerSet(server.id, weapon).then((players) => {
        players.forEach((player) => {
          promises.push(processWeaponReport(weapon, server.id, player))
        })
      })
    )
  })
  //iterate through all players outside of servers
  const players = await getPlayerSet(undefined, weapon)
  players.forEach((player) => {
    promises.push(processWeaponReport(weapon, undefined, player))
  })
  //global weapon data
  promises.push(processWeaponReport(weapon))
  await Promise.all(promises)
}

async function populateAllSets() {
  const servers = await db.selectFrom('server').selectAll().execute()
  await Promise.all([populatePlayerSet(), populateWeaponSet()])
  await (async () => {
    const promises: Promise<any>[] = []
    await getWeaponSet().then((weaponSet) => {
      weaponSet.forEach((weapon: string) => {
        promises.push(populatePlayerSet(undefined, weapon))
      })
    })

    await getPlayerSet().then((playerSet) => {
      playerSet.forEach((player) => {
        promises.push(populateWeaponSet(undefined, player))
      })
    })
    return Promise.all(promises)
  })()

  await (async () => {
    const promises: Promise<any>[] = servers.map((server) =>
      (async () => {
        await Promise.all([
          populatePlayerSet(server.id),
          populateWeaponSet(server.id)
        ])
        const promises: Promise<any>[] = []
        await getWeaponSet(server.id).then((weaponSet) => {
          weaponSet.forEach((weapon: string) => {
            promises.push(populatePlayerSet(server.id, weapon))
          })
        })
        await getPlayerSet(server.id).then((playerSet) => {
          playerSet.forEach((player) => {
            promises.push(populateWeaponSet(server.id, player))
          })
        })
        return Promise.all(promises)
      })()
    )
    await Promise.all(promises)
  })()
}

async function processAllLists() {
  const promises: Promise<any>[] = []
  promises.push(processPlayerList(), processWeaponList())
  promises.push(
    ...(await getPlayerSet()).map((player) =>
      processWeaponList(undefined, player)
    ),
    ...(await (
      await getWeaponSet()
    ).map((weapon) => processPlayerList(undefined, weapon)))
  )
  const servers = await db.selectFrom('server').selectAll().execute()
  promises.push(
    ...servers.map(async ({ id }) => {
      const promises: Promise<any>[] = []
      promises.push(
        processWeaponList(id),
        processPlayerList(id),
        ...(await getPlayerSet()).map((player) =>
          processWeaponList(id, player)
        ),
        ...(await (
          await getWeaponSet()
        ).map((weapon) => processPlayerList(id, weapon)))
      )
      await Promise.all(promises)
    })
  )
  await Promise.all(promises)
}
export default processAll
