import { RequestHandler } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../common'
import cache from '../cache/redis'
import { sql } from 'kysely'
import db from '../db/db'

const { count, max } = db.fn

const middlewares: RequestHandler[] = [
  param('serverId').exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const server = Number(req.params.serverId)
    await processServerPlayers(server)
    let data = await getServerPlayers(server)
    res.status(200).send(data)
  }
]

async function getServerPlayers(server: number) {
  const killsData = await cache.HGETALL(`servers:${server}:players:kills`)
  const deathData = await cache.HGETALL(`servers:${server}:players:deaths`)
  const data: { [x: string]: { kills: string; deaths: string } } = {}
  Object.keys(killsData).forEach((key) => {
    data[key] = { kills: killsData[key], deaths: deathData[key] }
  })
  return data
}

async function processServerPlayers(server: number) {
  let last_entry =
    Number(await cache.HGET(`servers:${server}:players`, 'last_entry')) || 0
  const newData = await db
    .with('killdata', () =>
      db
        .selectFrom('kill')
        .select([count('kill.id').as('num_kills'), 'kill.attacker_id'])
        .where('kill.id', '>', last_entry)
        .where('kill.server', '=', server)
        .whereRef('attacker_id', '!=', 'victim_id')
        .groupBy('attacker_id')
    )
    .with('deathdata', () =>
      db
        .selectFrom('kill')
        .select([count('kill.id').as('num_deaths'), 'kill.victim_id'])
        .where('kill.id', '>', last_entry)
        .where('kill.server', '=', server)
        .groupBy('victim_id')
    )
    .selectFrom('killdata')
    .select([
      sql<number>`coalesce(killdata.num_kills, 0)`.as('kills'),
      sql<number>`coalesce(deathdata.num_deaths, 0)`.as('deaths'),
      sql<string>`COALESCE(killdata.attacker_id, deathdata.victim_id)`.as(
        'player'
      ),
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
  last_entry = newData.reduce(
    (acc, current) => (current.last_entry > acc ? current.last_entry : acc),
    0
  )
  const promises: Promise<number>[] = []
  newData.forEach(({ kills, deaths, player }) => {
    promises.push(
      cache.HINCRBY(`servers:${server}:players:kills`, player, kills),
      cache.HINCRBY(`servers:${server}:players:deaths`, player, deaths)
    )
  })
  promises.push(
    cache.HSET(`servers:${server}:players`, 'last_entry', newData[0].last_entry)
  )
  await Promise.all(promises)
}

export default middlewares
