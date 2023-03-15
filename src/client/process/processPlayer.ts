/**
 * This file contains all functions related to population of the REDIS database for players.
 */
import db from '../../db/db'
import cache from '../../cache/redis'
import { getPlayerReport, getPlayerSet } from '../../cache/cacheUtils'
import { sql } from 'kysely'
const { count, max, avg } = db.fn

/**
 * Populates the set of players (just a list with player IDS)
 *
 * Inputs `POSTGRESQL`
 *
 * Outputs `SET` `[servers:{serverId}:][weapons:{weaponId}:]players`
 * @param server optional server filter
 * @param weapon optional weapon filter
 * @returns
 */
export async function populatePlayerSet(server?: number, weapon?: string) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const weaponPrefix = weapon ? `weapons:${weapon}:` : ''
  const cacheLocation = serverPrefix + weaponPrefix + `players`
  const last_entry = Number(await cache.GET(cacheLocation + ':last_entry')) || 0
  let query = db
    .selectFrom('kill')
    .select([
      'attacker_id',
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .groupBy('attacker_id')
    .where('kill.id', '>', last_entry)
  if (server) {
    query = query.where('server', '=', server)
  }
  if (weapon) {
    query = query.where('cause_of_death', '=', weapon)
  }
  const newData = await query.execute()
  if (newData.length == 0) {
    return
  }
  const promises: Promise<any>[] = []
  newData.forEach(({ attacker_id }) => {
    if (attacker_id == 'last_entry' || attacker_id == 'processedList') {
      console.error('attacker_id cannot be ' + attacker_id)
      return
    }
    promises.push(cache.SADD(cacheLocation, attacker_id))
  })
  promises.push(cache.SET(cacheLocation + ':last_entry', newData[0].last_entry))
  await Promise.all(promises)
}

/**
 * Processes player kills with optional server and/or weapon filter.
 * Does not processes deaths from weapons.
 *
 * Inputs `POSTGRESQL`
 *
 * Outputs `HASH` `[servers:{serverId}:][weapon:{weaponId}:]players:{playerId}`
 * @param player weapon to generate the report for
 * @param server optional server filter
 * @param weapon optional player filter
 */

export async function processPlayerReport(
  player: string,
  server?: number,
  weapon?: string
) {
  if (player == 'last_entry' || player == 'processedList') {
    console.error('Player cannot be ' + player)
    return
  }
  const serverPrefix = server ? `servers:${server}:` : ''
  const weaponPrefix = weapon ? `weapons:${weapon}:` : ''
  const cacheLocation = serverPrefix + weaponPrefix + `players:` + player
  const last_entry = Number(await cache.HGET(cacheLocation, 'last_entry')) || 0
  let query = db
    .selectFrom('kill')
    .select([
      sql<string>`percentile_disc(0) WITHIN GROUP (ORDER BY attacker_name) FILTER (where attacker_id = ${player})`.as(
        'username'
      ),
      count<number>('id')
        .filterWhere('attacker_id', '=', player)
        .filterWhereRef('attacker_id', '!=', 'victim_id')
        .as('kills'),
      count<number>('id').filterWhere('victim_id', '=', player).as('deaths'),
      avg<number>('kill.distance')
        .filterWhere('attacker_id', '=', player)
        .as('avg_kill_distance'),
      max('kill.distance')
        .filterWhere('attacker_id', '=', player)
        .as('max_kill_distance'),
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .where((qb) =>
      qb.where('attacker_id', '=', player).orWhere('victim_id', '=', player)
    )
    .where('kill.id', '>', last_entry)
  if (server) {
    query = query.where('server', '=', server)
  }
  if (weapon) {
    query = query.where('cause_of_death', '=', weapon)
  }
  const newData = await query.execute()
  if (newData.length == 0) {
    return
  }
  const promises: Promise<any>[] = []
  newData.forEach(
    ({ kills, avg_kill_distance, max_kill_distance, deaths, username }) => {
      if (!username) return
      promises.push(
        processAvg(cacheLocation, 'avg_kill_distance', {
          newkills: kills || 0,
          newavg: avg_kill_distance || 0
        }).then((e) => cache.HINCRBY(cacheLocation, 'kills', kills || 0)),
        cache.HINCRBY(cacheLocation, 'deaths', deaths || 0),
        cache.HSET(cacheLocation, 'username', username),
        processMax(cacheLocation, 'max_kill_distance', max_kill_distance)
      )
    }
  )

  promises.push(cache.HSET(cacheLocation, 'last_entry', newData[0].last_entry))
  await Promise.all(promises)
}

async function processAvg(
  cacheLocation: string,
  key: 'avg_kill_distance',
  { newkills, newavg }: { newkills: number; newavg: number }
) {
  const oldKills = Number(await cache.HGET(cacheLocation, 'kills')) || 0
  const oldaverage = Number(await cache.HGET(cacheLocation, key)) || 0
  const totalkills = Number(oldKills) + Number(newkills)
  const newAverage =
    (oldKills / totalkills) * oldaverage + (newkills / totalkills) * newavg || 0
  await cache.HSET(cacheLocation, key, newAverage)
}

async function processMax(
  cacheLocation: string,
  key: 'max_kill_distance',
  newmax: number
) {
  const oldMax = Number(await cache.HGET(cacheLocation, key)) || 0
  if (oldMax < newmax || oldMax == 0)
    await cache.HSET(cacheLocation, key, newmax || 0)
}

/**
 * Combines player reports in a readable json string.
 *
 * ProcessPlayerReport must be called manually before this function !
 *
 * Inputs `SET` `[servers:{serverId}:][weapons:{weaponId}:]players`
 *
 * Outputs `STRING` `[servers:{serverId}:][weapons:{weaponId}:]players:processedList`
 * @param server optional server filter
 * @param weapon optional player filter
 * @returns
 */
export async function processPlayerList(server?: number, weapon?: string) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const weaponPrefix = weapon ? `weapons:${weapon}:` : ''
  const cacheLocation = serverPrefix + weaponPrefix + `players`
  const players = await getPlayerSet(server, weapon)
  const promises: Promise<any>[] = []
  const data: {
    [playerId: string]: {
      [playerData: string]: string
    }
  } = {}
  players.forEach((plr) => {
    promises.push(
      (async () => {
        const playerData = await getPlayerReport(plr, server, weapon)
        if (Object.keys(playerData).length > 0) {
          data[plr] = playerData
        }
      })()
    )
  })
  await Promise.all(promises)
  return await cache.SET(cacheLocation + `:processedList`, JSON.stringify(data))
}
