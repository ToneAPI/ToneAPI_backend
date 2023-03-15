/**
 * This file contains all functions related to population of the REDIS database for weapons.
 */
import db from '../../db/db'
import cache from '../../cache/redis'
import { getWeaponReport } from '../../cache/cacheUtils'
const { count, max, avg } = db.fn

/**
 * Populates the set of weapons (just a list with weapon names)
 *
 * Inputs `POSTGRESQL`
 *
 * Outputs `SET` `[servers:{serverId}:][players:{playerId}:]weapons`
 * @param server optional server filter
 * @param player optional player filter
 * @returns
 */
export async function populateWeaponSet(server?: number, player?: string) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons`
  const last_entry = Number(await cache.GET(cacheLocation + ':last_entry')) || 0
  let query = db
    .selectFrom('kill')
    .select([
      'cause_of_death',
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .groupBy('cause_of_death')
    .where('kill.id', '>', last_entry)
  if (server) {
    query = query.where('server', '=', server)
  }
  if (player) {
    query = query
      .where('attacker_id', '=', player)
      .orWhere('victim_id', '=', player)
  }
  const newData = await query.execute()
  if (newData.length == 0) {
    return
  }
  const promises: Promise<any>[] = []
  newData.forEach(({ cause_of_death }) => {
    if (cause_of_death == 'last_entry' || cause_of_death == 'processedList') {
      console.error('cause_of_death cannot be ' + cause_of_death)
      return
    }
    promises.push(cache.SADD(cacheLocation, cause_of_death))
  })
  promises.push(cache.SET(cacheLocation + ':last_entry', newData[0].last_entry))
  await Promise.all(promises)
}

/**
 * Processes weapon kills with optional server and/or player filter.
 * Does not processes deaths from weapons.
 *
 * Inputs `POSTGRESQL`
 *
 * Outputs `HASH` `[servers:{serverId}:][players:{playerId}:]weapons:{weaponId}`
 * @param weapon weapon to generate the report for
 * @param server optional server filter
 * @param player optional player filter
 */

export async function processWeaponReport(
  weapon: string,
  server?: number,
  player?: string
) {
  if (weapon == 'last_entry' || weapon == 'processedList') {
    console.error('Weapon cannot be ' + weapon)
    return
  }
  const serverPrefix = server ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons:` + weapon
  const last_entry = Number(await cache.HGET(cacheLocation, 'last_entry')) || 0
  let query = db
    .selectFrom('kill')
    .select([
      count<number>('id').as('kills'),
      avg<number>('kill.distance').as('avg_kill_distance'),
      max('kill.distance').as('max_kill_distance'),
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .where('cause_of_death', '=', weapon)
    .whereRef('attacker_id', '!=', 'victim_id')
    .where('kill.id', '>', last_entry)
    .groupBy('cause_of_death')
  if (server) {
    query = query.where('server', '=', server)
  }
  if (player) {
    query = query.where('attacker_id', '=', player)
  }
  const newData = await query.execute()

  if (newData.length == 0) {
    return
  }
  const promises: Promise<any>[] = []
  newData.forEach(({ kills, avg_kill_distance, max_kill_distance }) => {
    promises.push(
      processAvg(cacheLocation, 'avg_kill_distance', {
        newkills: kills,
        newavg: avg_kill_distance
      }).then((e) => cache.HINCRBY(cacheLocation, 'kills', kills)),
      processMax(cacheLocation, 'max_kill_distance', max_kill_distance)
    )
  })
  promises.push(cache.HSET(cacheLocation, 'last_entry', newData[0].last_entry))
  await Promise.all(promises)
}

async function processAvg(
  cacheLocation: string,
  key: 'avg_kill_distance',
  { newkills, newavg }: { newkills: number; newavg: number }
) {
  const oldKills = Number(await cache.HGET(cacheLocation, 'kills')) || 0
  const oldaverage = Number(await cache.HGET(cacheLocation, key)) | 0
  const totalkills = oldKills + newkills
  const newAverage =
    (oldKills / totalkills) * oldaverage + (newkills / totalkills) * newavg
  await cache.HSET(cacheLocation, key, newAverage)
}

async function processMax(
  cacheLocation: string,
  key: 'max_kill_distance',
  newmax: number
) {
  const oldMax = Number(await cache.HGET(cacheLocation, key)) || -1
  newmax = newmax || 0
  if (!oldMax || !newmax) console.log(oldMax, newmax)
  if (oldMax < newmax) await cache.HSET(cacheLocation, key, newmax)
}

/**
 * Combines weapons reports in a readable json string.
 *
 * ProcessWeaponReports must be called manually before this function !
 *
 * Inputs `SET` `[servers:{serverId}:][players:{playerId}:]weapons`
 *
 * Outputs `STRING` `[servers:{serverId}:][players:{playerId}:]weapons:processedList`
 * @param server optional server filter
 * @param player optional player filter
 * @returns
 */
export async function processWeaponList(server?: number, player?: string) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons`
  const weapons = await cache.SMEMBERS(cacheLocation)
  const promises: Promise<any>[] = []
  const data: {
    [weaponId: string]: {
      [weaponData: string]: string
    }
  } = {}
  weapons.forEach((wpn) => {
    promises.push(
      (async () => {
        const weaponData = await getWeaponReport(wpn, server, player)
        if (Object.keys(weaponData).length > 0) {
          data[wpn] = weaponData
        }
      })()
    )
  })
  await Promise.all(promises)
  return await cache.SET(cacheLocation + `:processedList`, JSON.stringify(data))
}
