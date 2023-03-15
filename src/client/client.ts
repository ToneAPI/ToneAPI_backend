import { Router } from 'express'
import { param, query } from 'express-validator'
import { validateErrors } from '../common'
import serverList from './routes/serverList'
import {
  getWeaponList,
  getWeaponReport,
  getPlayerReport,
  getPlayerList
} from '../cache/cacheUtils'
const router = Router()
//timeout middleware ?
router.get('/*', (req, res, next) => {
  next()
})

router.get(
  '/weapons/:weaponId',
  param(['weaponId']).exists().isString(),
  query(['player', 'server']).optional().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const data = await getWeaponReport(
      req.params.weaponId,
      Number(req.query.server) || undefined,
      req.query.player?.toString()
    )
    res.status(200).send(data)
  }
)

router.get(
  '/weapons/',
  query(['player', 'server']).optional().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const data = await getWeaponList(
      req.query.server?.toString(),
      req.query.player?.toString()
    )
    res.status(200).send(data)
  }
)

router.get(
  '/players/:playerId',
  param(['playerId']).exists().toInt().isInt(),
  query(['server']).optional().toInt().isInt(),
  query('weapon').optional().isString(),
  validateErrors,
  async (req, res) => {
    const data = await getPlayerReport(
      req.params.playerId,
      Number(req.query.server) || undefined,
      req.query.weapon?.toString()
    )
    if (!req.query.weapon) {
      const weapons = await getWeaponList(
        req.query.server?.toString(),
        req.params.playerId
      )
      data.weapons = weapons
    } else {
      data.weapons = (await getWeaponReport(
        req.query.weapon.toString(),
        Number(req.query.server) || undefined,
        req.params.playerId
      )) as any
    }
    res.status(200).send(data)
  }
)

router.get(
  '/players/',
  query(['server']).optional().toInt().isInt(),
  query('weapon').optional().isString(),
  validateErrors,
  async (req, res) => {
    const data = await getPlayerList(
      Number(req.query.server) || undefined,
      req.query.weapon?.toString()
    )
    res.status(200).send(data)
  }
)

//router.get('/maps/', (req, res, next) => {})

router.get('/servers/', serverList)
//router.get('/servers/:serverId/', (req, res, next) => {})

export default router
