import { RequestHandler } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../../common'
import cache from '../../cache/redis'
import { sql } from 'kysely'
import db from '../../db/db'

const { count, max, avg } = db.fn

const middlewares: RequestHandler[] = [
  param(['serverId']).exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const server = Number(req.params.serverId)
    //await processServerWeapons(server)
    const data = await getServerWeapons(server)
    res.status(200).send(data)
  }
]

export async function getServerWeapons(server: number) {
  const killsData = await cache.HGETALL(`servers:${server}:weapons:kills`)
  const avg_distance = await cache.HGETALL(
    `servers:${server}:weapons:avg_kill_distance`
  )
  const max_distance = await cache.HGETALL(
    `servers:${server}:weapons:max_kill_distance`
  )
  const data: {
    [x: string]: {
      kills: string
      avg_kill_distance: string
      max_kill_distance: string
    }
  } = {}
  Object.keys(killsData).forEach((key) => {
    data[key] = {
      kills: killsData[key],
      avg_kill_distance: avg_distance[key],
      max_kill_distance: max_distance[key]
    }
  })
  return data
}

export async function processServerWeapons(server: number) {
  let last_entry =
    Number(await cache.HGET(`servers:${server}:weapons`, 'last_entry')) || 0
  const newData = await db
    .with('killdata', () =>
      db
        .selectFrom('kill')
        .select([
          count('kill.id').as('num_kills'),
          'kill.cause_of_death',
          max('distance').as('max_kill_distance'),
          avg('distance').as('avg_kill_distance')
        ])
        .where('kill.id', '>', last_entry)
        .where('kill.server', '=', server)
        .whereRef('attacker_id', '!=', 'victim_id')
        .groupBy('cause_of_death')
    )
    .selectFrom('killdata')
    .select([
      sql<number>`coalesce(killdata.num_kills, 0)`.as('kills'),
      'killdata.cause_of_death',
      'killdata.avg_kill_distance',
      'killdata.max_kill_distance',
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .orderBy('kills', 'desc')
    .execute()
  //if no new kills
  if (newData.length == 0) {
    return
  }
  last_entry = newData.reduce(
    (acc, current) => (current.last_entry > acc ? current.last_entry : acc),
    0
  )
  const promises: Promise<any>[] = []
  newData.forEach(
    ({ cause_of_death, kills, avg_kill_distance, max_kill_distance }) => {
      promises.push(
        (async () => {
          const oldKills =
            Number(
              await cache.HGET(
                `servers:${server}:weapons:kills`,
                cause_of_death
              )
            ) || 0
          const oldaverage =
            Number(
              await cache.HGET(
                `servers:${server}:weapons:avg_kill_distance`,
                cause_of_death
              )
            ) | 0
          const totalkills = oldKills + kills
          const newAverage =
            (oldKills / totalkills) * oldaverage +
            (kills / totalkills) * Number(avg_kill_distance)

          const oldMaxDistance =
            Number(
              await cache.HGET(
                `servers:${server}:weapons:max_kill_distance`,
                cause_of_death
              )
            ) | 0

          promises.push(
            cache.HINCRBY(
              `servers:${server}:weapons:kills`,
              cause_of_death,
              kills
            ),
            cache.HSET(
              `servers:${server}:weapons:avg_kill_distance`,
              cause_of_death,
              newAverage | 0
            ),
            cache.HSET(
              `servers:${server}:weapons:max_kill_distance`,
              cause_of_death,
              oldMaxDistance < max_kill_distance
                ? max_kill_distance
                : oldMaxDistance
            )
          )
        })()
      )
    }
  )
  promises.push(
    cache.HSET(`servers:${server}:weapons`, 'last_entry', newData[0].last_entry)
  )
  await Promise.all(promises)
}

export default middlewares
