import db from '../db/db'
const { count, max, sum } = db.fn
import client from '../cache/redis'
import { createWeaponJson } from './process/processWeapon'
import { createPlayerJson } from './process/processPlayer'

/**
 * Starts the process of populating the REDIS database globally
 * @returns
 */
async function processAll() {
  console.log('Starting data calculation...')
  const timeStart = new Date()

  await Promise.all([processGlobalStats(), processServerStats()])
  console.log(
    'Data calculation finished. Took + ' +
    Math.abs(new Date().getTime() - timeStart.getTime()) / 1000 +
    ' seconds'
  )
  if (process.env.ENVIRONMENT == 'production') {
    return
  }
  setTimeout(processAll, 3600000)
}

async function processGlobalStats() {
  let promises: Promise<any>[] = []
  //Global kills
  promises.push(db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance')])
    .execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ kills, max_distance, total_distance }) => {
        transaction = processGlobalData({ kills, max_distance, total_distance }, transaction)
      })
      return transaction.exec()
    }))

  //Global weapon kill
  promises.push(db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'cause_of_death'])
    .groupBy('cause_of_death').execute().then(async (data) => {
      let transaction = client.multi()
      data.forEach(({ kills, max_distance, total_distance, cause_of_death }) => {
        transaction = processWeaponData({ kills, max_distance, total_distance, cause_of_death }, transaction)
      })
      await transaction.exec()
    }))

  //Player weapon kills
  promises.push(db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'cause_of_death', 'attacker_id'])
    .groupBy(['cause_of_death', 'attacker_id']).execute().then(async (data) => {
      let transaction = client.multi()
      data.forEach(({ kills, max_distance, total_distance, cause_of_death, attacker_id }) => {
        transaction = processWeaponData({ kills, max_distance, total_distance, cause_of_death, attacker_id }, transaction)
      })
      await transaction.exec()
    }))
  //Player weapon deaths
  promises.push(db.selectFrom('kill').select([count('id').as('deaths'), 'victim_id', 'cause_of_death'])
    .groupBy(['victim_id', 'cause_of_death']).execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ deaths, victim_id, cause_of_death }) => {
        transaction = transaction.HSET(`weapons:${cause_of_death}:players:${victim_id}`, "deaths", deaths.toString())
      })
      return transaction.exec()
    }))

  //Global player kills
  promises.push(db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'attacker_id'])
    .groupBy('attacker_id').execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ kills, max_distance, total_distance, attacker_id }) => {
        processPlayerData({ kills, max_distance, total_distance, attacker_id }, transaction)
      })
      return transaction.exec()
    })
  )
  //Global player deaths
  promises.push(db.selectFrom('kill').select([count('id').as('deaths'), 'victim_id'])
    .groupBy('victim_id').execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ deaths, victim_id }) => {
        transaction = transaction.HSET('players:' + victim_id, "deaths", deaths.toString())
      })
      return transaction.exec()
    }))

  await Promise.all(promises)
  promises = [];
  promises.push(createWeaponJson());
  promises.push(createPlayerJson());
  (await client.sMembers('players')).forEach((player: string) => {
    promises.push(createWeaponJson(undefined, player))
  });
  (await client.sMembers('weapons')).forEach((weapon: string) => {
    promises.push(createPlayerJson(undefined, weapon))
  });
  await Promise.all(promises)
}

async function processServerStats() {
  let promises: Promise<any>[] = []
  //Server global kills
  promises.push(db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'server'])
    .groupBy(['server']).execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ kills, max_distance, total_distance, server }) => {
        transaction = processGlobalData({ kills, max_distance, total_distance, server }, transaction)
      })
      return transaction.exec()
    }))
  //Server weapon kills
  promises.push(db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'cause_of_death', 'server'])
    .groupBy(['cause_of_death', 'server']).execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ kills, max_distance, total_distance, cause_of_death, server }) => {
        transaction = processWeaponData({ kills, max_distance, total_distance, cause_of_death, server }, transaction)
      })
      return transaction.exec()
    }))

  //Server Player weapon kills
  promises.push(db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'cause_of_death', 'attacker_id', 'server'])
    .groupBy(['cause_of_death', 'attacker_id', 'server']).execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ kills, max_distance, total_distance, cause_of_death, attacker_id, server }) => {
        transaction = processWeaponData({ kills, max_distance, total_distance, cause_of_death, attacker_id, server }, transaction)
      })
      return transaction.exec()
    }))
  //Server Player weapon deaths
  promises.push(db.selectFrom('kill').select([count('id').as('deaths'), 'victim_id', 'cause_of_death', 'server'])
    .groupBy(['victim_id', 'cause_of_death', 'server']).execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ deaths, victim_id, cause_of_death, server }) => {
        transaction = transaction.HSET(`servers:${server}:weapons:${cause_of_death}:players:${victim_id}`, "deaths", deaths.toString())
      })
      return transaction.exec()
    }))

  //server player kills
  promises.push(db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'attacker_id', 'server'])
    .groupBy(['attacker_id', 'server']).execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ kills, max_distance, total_distance, attacker_id, server }) => {
        transaction = processPlayerData({ kills, max_distance, total_distance, attacker_id, server }, transaction)
      })
      return transaction.exec()
    })
  )

  //server player deaths
  promises.push(db.selectFrom('kill').select([count('id').as('deaths'), 'victim_id', 'server'])
    .groupBy(['victim_id', 'server']).execute().then(data => {
      let transaction = client.multi()
      data.forEach(({ deaths, victim_id, server }) => {
        transaction = transaction.HSET('servers:' + server + ':players:' + victim_id, "deaths", deaths.toString())
      })
      return transaction.exec()
    }))

  await Promise.all(promises)
  promises = [];
  ((await client.sMembers('servers')).forEach((server: string) => {
    if (isNaN(Number(server))) return
    promises.push(createWeaponJson(Number(server)));
    promises.push(createPlayerJson(Number(server)));
    promises.push(client.sMembers('servers:' + server + ':players').then(data => {
      data.forEach((player: string) => {
        promises.push(createWeaponJson(Number(server), player))
      })
    }))
    promises.push(client.sMembers('servers:' + server + 'weapons').then(data => {
      data.forEach((weapon: string) => {
        promises.push(createPlayerJson(Number(server), weapon))
      })
    }))
  }));

  await Promise.all(promises)
}

function processGlobalData({ kills, max_distance, total_distance, server }: { kills: string | number | bigint, max_distance: number, total_distance: string | number | bigint, server?: number }, transaction: any) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const cacheLocation = serverPrefix + 'global'
  transaction = transaction.HSET(cacheLocation, "total_distance", total_distance.toString())
  transaction = transaction.HSET(cacheLocation, "max_distance", max_distance.toString())
  transaction = transaction.HSET(cacheLocation, "kills", kills.toString())
  if (server) {
    transaction = transaction.SADD('servers', server.toString())
  }

  return transaction
}

function processWeaponData({ kills, max_distance, total_distance, cause_of_death, attacker_id, server }: { kills: string | number | bigint, max_distance: number, total_distance: string | number | bigint, cause_of_death: string, attacker_id?: string, server?: number }, transaction: any) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const playerPrefix = attacker_id ? `players:${attacker_id}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons:` + cause_of_death
  transaction = transaction.HSET(cacheLocation, "total_distance", total_distance.toString())
  transaction = transaction.HSET(cacheLocation, "max_distance", max_distance.toString())
  transaction = transaction.HSET(cacheLocation, "kills", kills.toString())
  transaction = transaction.SADD(serverPrefix + playerPrefix + `weapons`, cause_of_death.toString())
  return transaction
}

function processPlayerData({ kills, max_distance, total_distance, attacker_id, cause_of_death, server }: { kills: string | number | bigint, max_distance: number, total_distance: string | number | bigint, attacker_id: string, server?: number, cause_of_death?: string }, transaction: any) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const weaponPrefix = cause_of_death ? `weapons:${cause_of_death}:` : ''
  const cacheLocation = serverPrefix + weaponPrefix + `players:` + attacker_id

  transaction = transaction.HSET(cacheLocation, "total_distance", total_distance.toString())
  transaction = transaction.HSET(cacheLocation, "max_distance", max_distance.toString())
  transaction = transaction.HSET(cacheLocation, "kills", kills.toString())
  transaction = transaction.SADD(serverPrefix + weaponPrefix + `players`, attacker_id.toString())
  return transaction
}

export default processAll
