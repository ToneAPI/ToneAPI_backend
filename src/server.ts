import { Router } from 'express'
import { CreateKillRecord } from './db/db'
import { body } from 'express-validator'
const router = Router()

//auth middleware
router.post('/*', (req, res, next) => {
  next()
})
router.post(
  '/severs/:serverId/kills',
  body('server').isString(),
  body('attacker').isInt(),
  body('victim').isInt(),
  body('weapon').isString(),
  body('map').isString(),
  body('distance').isInt(),
  (req, res, next) => {
    //CreateKillRecord({ server, attacker, victim, weapon, map, distance })
    res.send(400)
  }
)
export default router
