import { NextFunction, Router } from 'express'
import expressBasicAuth from 'express-basic-auth'
import { body, header, validationResult } from 'express-validator'
import register from './register'
import { CreateKillRecord, CheckServerToken } from '../db/db'

const router = Router()

router.use('/', register)

//auth middleware
router.post(
  '/servers/:serverId/*',
  header('authorization')
    .exists({ checkFalsy: true })
    .withMessage('Missing Authorization Header')
    .bail()
    .contains('Basic')
    .withMessage('Authorization Token is not Basic'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(JSON.stringify(errors))
      return res.status(403).json({ errors: errors.array() })
    }
    next()
  },
  //Huge mess to retrieve server id from expressBasicAuth. We probably should fix it.
  (req, res, next) => {
    if (!req) res.send(500)
    return expressBasicAuth({
      authorizeAsync: true,
      authorizer: CheckServerToken.bind(req),
      unauthorizedResponse: { error: 'invalid credentials' }
    })(req as any, res, next)
  }
)

router.post('/servers/:serverId', (req, res) => {
  res.send(200)
})

const serversCount: { [id: string]: number } = {}
const serversTimeout: { [id: string]: NodeJS.Timeout } = {}

//same rate limiting code as register. max 10 kills per server every 1 sec. should be enough.
router.post('/servers/:serverId/kill', (req, res, next) => {
  let serverId = req.body.serverId || 'undefined'
  if (serversCount[serverId] > 2) {
    return res.status(429).json({
      error: 'too many requests. Are players really making that much kills ?'
    })
  }
  clearTimeout(serversTimeout[serverId])
  serversCount[serverId] =
    serversCount[serverId] ?? (serversCount[serverId] + 1) | 1
  serversTimeout[serverId] = setTimeout(() => {
    serversCount[serverId] = 0
  }, 1000)
  next()
})

router.post(
  '/servers/:serverId/kill',
  (req, res, next) => {
    console.log('recieved a message')
    console.log(JSON.stringify(req.body()))
    next()
  },
  body([
    'attacker_current_weapon_mods',
    'attacker_weapon_1_mods',
    'attacker_weapon_2_mods',
    'attacker_weapon_3_mods',
    'attacker_offhand_weapon_1',
    'attacker_offhand_weapon_2',
    'distance',
    'player_count',
    'victim_current_weapon_mods',
    'victim_weapon_1_mods',
    'victim_weapon_2_mods',
    'victim_weapon_3_mods',
    'victim_offhand_weapon_1',
    'victim_offhand_weapon_2'
  ])
    .toInt()
    .isInt()
    .withMessage('must be a valid int'),
  body(['distance', 'game_time'])
    .toFloat()
    .isFloat()
    .withMessage('must be a valid float'),
  body(
    [
      'attacker_id',
      'victim_id',
      'killstat_version',
      'match_id',
      'game_mode',
      'map',
      'attacker_name',
      'attacker_current_weapon',
      'attacker_weapon_1',
      'attacker_weapon_2',
      'attacker_weapon_3',
      'victim_name',
      'victim_current_weapon',
      'victim_weapon_1',
      'victim_weapon_2',
      'victim_weapon_3',
      'cause_of_death'
    ],
    'must be composed of a maximum of 50 valid ascii characters'
  )
    .isString()
    .isLength({ max: 50 })
    .isAscii(),
  body(['distance', 'game_time'], 'must be postitive floats').isFloat({
    min: 0
  }),
  body(['cause_of_death', 'victim_id'], 'mandatory').exists().notEmpty(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.error(JSON.stringify(errors))
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      killstat_version,
      match_id,
      game_mode,
      map,
      game_time,
      player_count,
      attacker_name,
      attacker_id,
      attacker_current_weapon,
      attacker_current_weapon_mods,
      attacker_weapon_1,
      attacker_weapon_1_mods,
      attacker_weapon_2,
      attacker_weapon_2_mods,
      attacker_weapon_3,
      attacker_weapon_3_mods,
      attacker_offhand_weapon_1,
      attacker_offhand_weapon_2,
      victim_name,
      victim_id,
      victim_current_weapon,
      victim_current_weapon_mods,
      victim_weapon_1,
      victim_weapon_1_mods,
      victim_weapon_2,
      victim_weapon_2_mods,
      victim_weapon_3,
      victim_weapon_3_mods,
      victim_offhand_weapon_1,
      victim_offhand_weapon_2,
      cause_of_death,
      distance
    } = req.body
    CreateKillRecord({
      killstat_version,
      server: req.body.serverId,
      match_id,
      game_mode,
      map,
      game_time,
      player_count,
      attacker_name,
      attacker_id,
      attacker_current_weapon,
      attacker_current_weapon_mods,
      attacker_weapon_1,
      attacker_weapon_1_mods,
      attacker_weapon_2,
      attacker_weapon_2_mods,
      attacker_weapon_3,
      attacker_weapon_3_mods,
      attacker_offhand_weapon_1,
      attacker_offhand_weapon_2,
      victim_name,
      victim_id,
      victim_current_weapon,
      victim_current_weapon_mods,
      victim_weapon_1,
      victim_weapon_1_mods,
      victim_weapon_2,
      victim_weapon_2_mods,
      victim_weapon_3,
      victim_weapon_3_mods,
      victim_offhand_weapon_1,
      victim_offhand_weapon_2,
      cause_of_death,
      distance
    })
      .then((e) => {
        res.send(201)
      })
      .catch((e) => {
        res.send(500)
      })
  }
)
export default router
