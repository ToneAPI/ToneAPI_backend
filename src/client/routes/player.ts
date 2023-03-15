import { RequestHandler } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../../common'
import cache from '../../cache/redis'
import { getWeaponList, getPlayerReport } from '../../cache/cacheUtils'
import { DataTypeNode, sql } from 'kysely'
import db from '../../db/db'
//import { getPlayerWeapons } from './serverPlayerWeapons'

//TODO : NOT WORKING AS OF NOW
const { count, max, min, avg } = db.fn

const middlewares: RequestHandler[] = [
  param(['serverId', 'playerId']).exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    //await processPlayerReport(server, player)
    const data = await getPlayerReport(
      req.params.playerId,
      Number(req.params.serverId)
    )
    const weapons = await getWeaponList(
      req.params.serverId,
      req.params.playerId
    )
    data.weapons = weapons
    res.status(200).send(data)
  }
]

export async function processPlayerReport(server: number, player: number) {
  let last_entry =
    Number(
      await cache.HGET(`servers:${server}:players:${player}`, 'last_entry')
    ) || 0
  const newData = await db
    .with('killdata', () =>
      db
        .selectFrom('kill')
        .select([
          count('kill.id').as('num_kills'),
          'kill.attacker_id',
          max('unix_time').as('last_seen'),
          min('unix_time').as('first_seen'),
          max('distance').as('max_kill_distance'),
          avg('distance').as('avg_kill_distance')
        ])
        .where('attacker_id', '=', player.toString())
        .where('kill.id', '>', last_entry)
        .where('kill.server', '=', server)
        .whereRef('attacker_id', '!=', 'victim_id')
        .groupBy('attacker_id')
    )
    .with('deathdata', () =>
      db
        .selectFrom('kill')
        .select([
          count('kill.id').as('num_deaths'),
          'kill.victim_id',
          max('unix_time').as('last_seen'),
          min('unix_time').as('first_seen')
        ])
        .where('victim_id', '=', player.toString())
        .where('kill.id', '>', last_entry)
        .where('kill.server', '=', server)
        .groupBy('victim_id')
    )
    .selectFrom('killdata')
    .select([
      sql<number>`coalesce(killdata.num_kills, 0)`.as('kills'),
      sql<number>`coalesce(deathdata.num_deaths, 0)`.as('deaths'),
      sql<number>`greatest(killdata.last_seen,deathdata.last_seen)`.as(
        'last_seen'
      ),
      sql<number>`least(killdata.first_seen,deathdata.first_seen)`.as(
        'first_seen'
      ),
      'killdata.max_kill_distance',
      'killdata.avg_kill_distance',
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .fullJoin('deathdata', 'deathdata.victim_id', 'killdata.attacker_id')
    .orderBy('kills', 'desc')
    .execute()
  //if no new kills
  if (newData.length == 0) {
    return
  }

  const promises: Promise<any>[] = []
  Object.entries(newData[0]).forEach(([key, value]) => {
    promises.push(
      (async () => {
        if (key == 'last_seen' || key == 'first_seen') {
          value = new Date(value || '').getTime()
        }
        if (key == 'first_seen') {
          cache.HSETNX(
            `servers:${server}:players:${player}`,
            key.toString(),
            (value || '').toString()
          )
          return
        }
        promises.push(
          cache.HSET(
            `servers:${server}:players:${player}`,
            key.toString(),
            (value || '').toString()
          )
        )
      })()
    )
  })
  await Promise.all(promises)
}

export default middlewares
