import { RequestHandler } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../common'
import cache from '../cache/redis'
import db from '../db/db'

const { count, max } = db.fn

const middlewares: RequestHandler[] = [
  param('serverId').exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const server = Number(req.params.serverId)
    await processWeapons(server)
    const data = await cache.HGETALL(`servers:${server}:weapons`)
    delete data.last_entry
    res.status(200).send(data)
  }
]

async function processWeapons(server: number) {
  let last_entry =
    Number(await cache.HGET(`servers:${server}:weapons`, 'last_entry')) || 0
  const newData = await db
    .selectFrom(['kill'])
    .select([
      count<number>('kill.id').as('num_kills'),
      'kill.cause_of_death',
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .where('server', '=', server)
    .where('kill.id', '>', last_entry)
    .groupBy('cause_of_death')
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
  newData.forEach(({ num_kills, cause_of_death }) => {
    promises.push(
      cache.HINCRBY(`servers:${server}:weapons`, cause_of_death, num_kills)
    )
  })
  promises.push(
    cache.HSET(`servers:${server}:weapons`, 'last_entry', newData[0].last_entry)
  )
  await Promise.all(promises)
}

export default middlewares
