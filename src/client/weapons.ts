import { Router } from 'express'
import { param, validationResult } from 'express-validator'
import cache from '../cache/redis'
import db from '../db/db'
const router = Router()
const { count, max } = db.fn

router.get(
  '/servers/:serverId/weapons',
  param('serverId').exists().toInt().isInt(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.error(JSON.stringify(errors))
      return res.status(400).json({ errors: errors.array() })
    }
    if (!req.params) {
      res.sendStatus(500)
      return
    }
    const server = Number(req.params.serverId)
    await processTopWeapons(server)
    const data = await cache.HGETALL(`servers:${server}:weapons`)
    delete data.last_entry
    res.status(200).send(data)
  }
)

async function processTopWeapons(server: number) {
  let last_entry =
    Number(await cache.HGET(`servers:${server}:weapons`, 'last_entry')) || 0
  const newData = await db
    .selectFrom(['kill'])
    .select([
      count<number>('kill.id').as('num_kills'),
      'kill.cause_of_death',
      max('kill.id').as('last_entry')
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

export default router
