import { Router } from 'express'
import weapons from './weapons'
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
router.get('/servers/:serverId/players', (req, res, next) => {})
router.get('/servers/:serverId/players/:playerId', (req, res, next) => {})

router.use('/', weapons)
export default router
