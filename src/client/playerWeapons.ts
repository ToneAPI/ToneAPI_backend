import { RequestHandler } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../common'
import cache from '../cache/redis'
import { sql } from 'kysely'
import db from '../db/db'

const { count, max, avg } = db.fn

const middlewares: RequestHandler[] = [
  param(['serverId', 'playerId']).exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const server = Number(req.params.serverId)
    const player = Number(req.params.playerId)
    await processPlayerWeapons(server, player)
    const data = await getPlayerWeapons(server, player)
    res.status(200).send(data)
  }
]

export async function getPlayerWeapons(server: number, player: number) {
  const killsData = await cache.HGETALL(
    `servers:${server}:players:${player}:weapons:kills`
  )
  const deathData = await cache.HGETALL(
    `servers:${server}:players:${player}:weapons:deaths`
  )
  const avg_distance = await cache.HGETALL(
    `servers:${server}:players:${player}:weapons:avg_kill_distance`
  )
  const max_distance = await cache.HGETALL(
    `servers:${server}:players:${player}:weapons:max_kill_distance`
  )
  const data: {
    [x: string]: {
      kills: string
      deaths: string
      avg_kill_distance: string
      max_kill_distance: string
    }
  } = {}
  Object.keys(killsData).forEach((key) => {
    data[key] = {
      kills: killsData[key],
      deaths: deathData[key],
      avg_kill_distance: avg_distance[key],
      max_kill_distance: max_distance[key]
    }
  })
  return data
}

async function processPlayerWeapons(server: number, player: number) {
  let last_entry =
    Number(
      await cache.HGET(
        `servers:${server}:players:${player}:weapons`,
        'last_entry'
      )
    ) || 0
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
        .where('attacker_id', '=', player.toString())
        .where('kill.id', '>', last_entry)
        .where('kill.server', '=', server)
        .whereRef('attacker_id', '!=', 'victim_id')
        .groupBy('cause_of_death')
    )
    .with('deathdata', () =>
      db
        .selectFrom('kill')
        .select([count('kill.id').as('num_deaths'), 'kill.cause_of_death'])
        .where('victim_id', '=', player.toString())
        .where('kill.id', '>', last_entry)
        .where('kill.server', '=', server)
        .groupBy('cause_of_death')
    )
    .selectFrom('killdata')
    .select([
      sql<number>`coalesce(killdata.num_kills, 0)`.as('kills'),
      sql<number>`coalesce(deathdata.num_deaths, 0)`.as('deaths'),
      sql<string>`COALESCE(killdata.cause_of_death, deathdata.cause_of_death)`.as(
        'weapon'
      ),
      'killdata.avg_kill_distance',
      'killdata.max_kill_distance',
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .fullJoin(
      'deathdata',
      'deathdata.cause_of_death',
      'killdata.cause_of_death'
    )
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
    async ({ weapon, kills, deaths, avg_kill_distance, max_kill_distance }) => {
      promises.push(
        (async () => {
          const oldKills =
            Number(
              await cache.HGET(
                `servers:${server}:players:${player}:weapons:kills`,
                weapon
              )
            ) || 0
          const oldaverage =
            Number(
              await cache.HGET(
                `servers:${server}:players:${player}:weapons:avg_kill_distance`,
                weapon
              )
            ) | 0
          const totalkills = oldKills + kills
          const newAverage =
            (oldKills / totalkills) * oldaverage +
            (kills / totalkills) * Number(avg_kill_distance)

          const oldMaxDistance =
            Number(
              await cache.HGET(
                `servers:${server}:players:${player}:weapons:max_kill_distance`,
                weapon
              )
            ) | 0

          promises.push(
            cache.HINCRBY(
              `servers:${server}:players:${player}:weapons:deaths`,
              weapon,
              deaths
            ),
            cache.HINCRBY(
              `servers:${server}:players:${player}:weapons:kills`,
              weapon,
              kills
            ),
            cache.HSET(
              `servers:${server}:players:${player}:weapons:avg_kill_distance`,
              weapon,
              newAverage | 0
            ),
            cache.HSET(
              `servers:${server}:players:${player}:weapons:max_kill_distance`,
              weapon,
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
    cache.HSET(
      `servers:${server}:players:${player}:weapons`,
      'last_entry',
      newData[0].last_entry
    )
  )
  await Promise.all(promises)
}

export default middlewares
