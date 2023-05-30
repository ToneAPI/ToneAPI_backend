import { Router } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../common'
import db, { getHostList } from '../db/db'
import { sql } from 'kysely'

const { max, sum } = db.fn
const router = Router()
// timeout middleware ?
router.get('/*', (req, res, next) => {
  next()
})

const queryFilters = {
  player: 'attacker_id',
  server: 'servername',
  map: 'map',
  weapon: 'cause_of_death',
  gamemode: 'game_mode',
  host: 'host'
} as const

const path = {
  player: 'attacker_id',
  servers: 'servername',
  maps: 'map',
  weapons: 'cause_of_death',
  gamemodes: 'game_mode',
  hosts: 'host'
} as const

interface KillRecord {
  kills: number
  deaths?: number
  deaths_while_equipped?: number
  username?: string
  max_distance: number
  total_distance: number
}

router.get('/hosts', (_req, res) => {
  void (async () => {
    const result = await getHostList()
    const data: Record<number, string> = {}
    result.forEach((e) => (data[Number(e.id)] = e.name))

    const dataString = JSON.stringify(data)
    const buffer = Buffer.from(dataString)
    const size = buffer.length
    res.status(200).setHeader('X-File-Size', size).setHeader('Content-Type', 'application/json').send(buffer)
  })()
})

function processQueryArgs (data: ReturnType<typeof db.selectFrom<'kill_view'>>, queryArgs: string | string[]): ReturnType<typeof db.selectFrom<'kill_view'>> {
  Object.entries(queryArgs).forEach(([one, two]) => {
    if (!two) return
    if (!(one in queryFilters)) return
    const key = one as keyof typeof queryFilters
    if (Array.isArray(two)) {
      data = data.where((qb) => {
        (two as string[]).forEach((e) => { qb = qb.orWhere(queryFilters[key], '=', e) })
        return qb
      })
    } else {
      data = data.where(queryFilters[key], '=', two)
    }
  })
  return data
}

router.get('/players',
  (req, res) => {
    void (async () => {
      let result = db.selectFrom('kill_view')
      if (req.query) {
        result = processQueryArgs(result, req.query as unknown as string | string[])
      }
      const selection = result.select([sum<number>('kills').as('kills'), sum<number>('deaths').as('deaths'), sum<number>('deaths_with_weapon').as('deaths_while_equipped'), 'attacker_id', sql<string>`last(attacker_name)`.as('username'), sum<number>('total_distance').as('total_distance'), max('max_distance').as('max_distance')]).groupBy('attacker_id')
      const data = (await selection.execute()).reduce<Record<string, KillRecord>>((acc, curr) => {
        acc[curr.attacker_id] = {
          kills: Number(curr.kills),
          deaths: Number(curr.deaths),
          max_distance: Number(curr.max_distance),
          total_distance: Number(curr.total_distance),
          deaths_while_equipped: Number(curr.deaths_while_equipped),
          username: curr.username
        }
        return acc
      }, {})
      const dataString = JSON.stringify(data)
      const buffer = Buffer.from(dataString)
      const size = buffer.length
      res.status(200).setHeader('X-File-Size', size).setHeader('Content-Type', 'application/json').send(buffer)
    })()
  })

router.get('/:dataType',
  param('dataType')
    .custom((e) => e in path)
    .withMessage('Only weapons, players, maps, gamemodes or servers are valid paths'),
  validateErrors,
  (req, res) => {
    void (async () => {
      let result = db.selectFrom('kill_view')
      if (req.query) {
        result = processQueryArgs(result, req.query as unknown as string | string[])
      }
      const dataType = req.params.dataType as keyof typeof path

      const selection = result.select([sum<number>('kills').as('kills'), sum<number>('deaths').as('deaths'), sum<number>('deaths_with_weapon').as('deaths_while_equipped'), path[dataType], sum<number>('total_distance').as('total_distance'), max('max_distance').as('max_distance')]).groupBy(path[dataType])
      const data = (await selection.execute()).reduce<Record<string, KillRecord>>((acc, curr) => {
        acc[curr[path[dataType]]] = {
          kills: Number(curr.kills),
          deaths: Number(curr.deaths),
          max_distance: Number(curr.max_distance),
          total_distance: Number(curr.total_distance),
          deaths_while_equipped: Number(curr.deaths_while_equipped)
        }
        return acc
      }, {})
      const dataString = JSON.stringify(data)
      const buffer = Buffer.from(dataString)
      const size = buffer.length
      res.status(200).setHeader('X-File-Size', size).setHeader('Content-Type', 'application/json').send(buffer)
    })()
  })

export default router
