import { Router } from 'express'
import { param, query } from 'express-validator'
import { validateErrors } from '../common'
import { allData } from '../process/process'
import { getHostList } from '../db/db'

const router = Router()
//timeout middleware ?
router.get('/*', (req, res, next) => {
  next()
})

function computeQueryParam(
  queryParam: string,
  comparison: string | number
): boolean {
  return queryParam.startsWith('!')
    ? queryParam.substring(1) != comparison
    : queryParam == comparison
}

function filters(e: typeof allData[0], query: any) {
  return (
    (query.player ? computeQueryParam(query.player, e.attacker_id) : true) &&
    (query.server ? computeQueryParam(query.server, e.servername) : true) &&
    (query.host ? computeQueryParam(query.host, e.host) : true) &&
    (query.map ? computeQueryParam(query.map, e.map) : true) &&
    (query.weapon ? computeQueryParam(query.weapon, e.cause_of_death) : true) &&
    (query.gamemode ? computeQueryParam(query.gamemode, e.game_mode) : true)
  )
}

router.get('/hosts', async (req, res) => {
  const result = await getHostList()
  const data: { [key: number]: string } = {}
  result.forEach((e) => (data[Number(e.id)] = e.name))
  res.status(200).send(data)
})

router.get(
  '/:dataType',
  param('dataType')
    .custom(
      (e) =>
        e == 'weapons' ||
        e == 'players' ||
        e == 'maps' ||
        e == 'servers' ||
        e == 'gamemodes'
    )
    .withMessage('Only weapons, players, maps or servers are valid paths'),
  query(['server', 'map', 'weapon', 'gamemode', 'player', 'host'])
    .optional()
    .isString(),
  validateErrors,
  (req, res) => {
    const data: {
      [key: string]: {
        deaths: number
        kills: number
        max_distance: number
        total_distance: number
        username?: string
        host?: number
        deaths_while_equipped?: number
      }
    } = {}
    let index:
      | 'cause_of_death'
      | 'attacker_id'
      | 'map'
      | 'servername'
      | 'game_mode'
    switch (req.params.dataType) {
      case 'weapons':
        index = 'cause_of_death'
        break
      case 'players':
        index = 'attacker_id'
        break
      case 'maps':
        index = 'map'
        break
      case 'servers':
        index = 'servername'
        break
      case 'gamemodes':
        index = 'game_mode'
        break
      default:
        return res.status(400).send()
    }
    const timeStart = new Date()
    allData
      .filter((e) => filters(e, req.query))
      .forEach((e) => {
        if (
          !e.cause_of_death ||
          !e.attacker_id ||
          !e.map ||
          !e.servername ||
          !e.game_mode
        )
          return
        const requestIndex = e[index]
        if (!requestIndex) return
        if (!data[requestIndex])
          data[requestIndex] = {
            deaths: 0,
            kills: 0,
            max_distance: 0,
            total_distance: 0
          }
        if (index === 'attacker_id')
          data[requestIndex].username = e.attacker_name
        if (index === 'servername') data[requestIndex].host = e.host
        if (
          index === 'cause_of_death' ||
          (req.query.weapon &&
            !req.query.weapon.toString().startsWith('!') &&
            index === 'attacker_id')
        )
          data[requestIndex].deaths_while_equipped =
            Number(e.deaths_with_weapon) +
            (data[requestIndex].deaths_while_equipped || 0)
        data[requestIndex].deaths += Number(e.deaths)
        data[requestIndex].kills += Number(e.kills)
        data[requestIndex].total_distance += Number(e.total_distance)
        data[requestIndex].max_distance = Math.max(
          data[requestIndex].max_distance,
          Number(e.max_distance)
        )
      })
    console.log(
      new Date().toLocaleString() + ',' +
      (req.headers['x-forwarded-for']?.toString() ||
        req.socket.remoteAddress?.toString() ||
        '') +
      ',' +
      Math.abs(new Date().getTime() - timeStart.getTime()) / 1000
    )
    res.status(200).send(data)
  }
)

export default router
