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
  const players = await cache.SMEMBERS(`servers:${server}:players`)
  const data: {
    [playerID: string]: {
      [playerData: string]: string
    }
  } = {}
  const promises: Promise<any>[] = []
  players.forEach((playerID) =>
    promises.push(
      cache
        .HGETALL(`servers:${server}:players:${playerID}`)
        .then((playerData) => {
          delete playerData.last_entry
          data[playerID] = playerData
        })
    )
  )
  await Promise.all(promises)
  return data
}

async function processServerPlayers(server: number) {
  let last_entry =
    Number(await cache.GET(`servers:${server}:players:last_entry`)) || 0
  const newData = await db
    .selectFrom('kill')
    .select([
      'attacker_id',
      db
        .selectFrom('kill')
        .select(max('kill.id').as('last_entry'))
        .as('last_entry')
    ])
    .where('kill.id', '>', last_entry)
    .groupBy('attacker_id')
    .execute()
  //if no new kills
  if (newData.length == 0) {
    return
  }
  const promises: Promise<any>[] = []
  newData.forEach(({ attacker_id }: { attacker_id: string }) => {
    promises.push(cache.SADD(`servers:${server}:players`, attacker_id))
  })
  promises.push(
    cache.SET(`servers:${server}:players:last_entry`, newData[0].last_entry)
  )
  await Promise.all(promises)
}

export default middlewares
