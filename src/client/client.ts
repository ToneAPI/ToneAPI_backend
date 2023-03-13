import { Router } from 'express'
import serverWeapons from './routes/serverWeapons'
import playerWeapons from './routes/playerWeapons'
import serverPlayers from './routes/serverPlayers'
import serverList from './routes/serverList'
import player from './routes/player'
const router = Router()
//timeout middleware ?
router.get('/*', (req, res, next) => {
  next()
})

//router.get('/weapons/', (req, res, next) => {})

//router.get('/maps/', (req, res, next) => {})

//router.get('/players', (req, res, next) => {})
//router.get('/players/:playerId', (req, res, next) => {})

router.get('/servers/', serverList)
//router.get('/servers/:serverId/', (req, res, next) => {})
router.get('/servers/:serverId/players', serverPlayers)
router.get('/servers/:serverId/players/:playerId', player)
router.get('/servers/:serverId/players/:playerId/weapons', playerWeapons)
router.use('/servers/:serverId/weapons', serverWeapons)

export default router
