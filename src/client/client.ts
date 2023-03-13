import { Router } from 'express'
import serverWeapons from './serverWeapons'
import playerWeapons from './playerWeapons'
import serverPlayers from './serverPlayers'
const router = Router()
//timeout middleware ?
router.get('/*', (req, res, next) => {
  next()
})

router.get('/weapons/', (req, res, next) => {})

router.get('/maps/', (req, res, next) => {})

router.get('/players', (req, res, next) => {})
router.get('/players/:playerId', (req, res, next) => {})

router.get('/servers/', (req, res, next) => {})
router.get('/servers/:serverId/', (req, res, next) => {})
router.get('/servers/:serverId/players', serverPlayers)
router.get('/servers/:serverId/player/:playerId', playerWeapons)

router.use('/servers/:serverId/weapons', serverWeapons)
export default router
