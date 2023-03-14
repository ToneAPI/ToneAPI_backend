import { Router } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../common'
import serverPlayers from './routes/serverPlayers'
import serverList from './routes/serverList'
import player from './routes/player'
import { getWeaponList, getWeaponReport } from '../cache/cacheUtils'
const router = Router()
//timeout middleware ?
router.get('/*', (req, res, next) => {
  next()
})

router.get('/weapons/', async (req, res) => {
  const data = JSON.parse((await getWeaponList()) || '{}')
  res.status(200).send(data)
})

router.get(
  '/weapons/:weaponId',
  param(['weaponId']).exists().isString(),
  validateErrors,
  async (req, res) => {
    const weapon = req.params.weaponId
    const data = await getWeaponReport(weapon)
    res.status(200).send(data)
  }
)

//router.get('/maps/', (req, res, next) => {})

//router.get('/players', (req, res, next) => {})
//router.get('/players/:playerId', (req, res, next) => {})

router.get('/players/:playerId/weapons')

router.get('/servers/', serverList)
//router.get('/servers/:serverId/', (req, res, next) => {})
router.get('/servers/:serverId/players', serverPlayers)
//router.get('/servers/:serverId/players/:playerId', player)

router.get(
  '/servers/:serverId/players/:playerId/weapons',
  param(['serverId', 'playerId']).exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const data = JSON.parse(
      (await getWeaponList(req.params.serverId, req.params.playerId)) || '{}'
    )
    res.status(200).send(data)
  }
)

router.get(
  '/servers/:serverId/players/:playerId/weapons:weaponId',
  param(['serverId', 'playerId, weaponId']).exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const data = getWeaponReport(
      req.params.weaponId,
      Number(req.params.serverId),
      Number(req.params.playerId)
    )
    res.status(200).send(data)
  }
)

router.use(
  '/servers/:serverId/weapons',
  param(['serverId']).exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const data = JSON.parse((await getWeaponList(req.params.serverId)) || '{}')
    res.status(200).send(data)
  }
)

router.use(
  '/servers/:serverId/weapons',
  param(['serverId']).exists().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    const data = getWeaponReport(
      req.params.weaponId,
      Number(req.params.serverId)
    )
    res.status(200).send(data)
  }
)

export default router
