import { NextFunction, Router } from 'express'
import expressBasicAuth from 'express-basic-auth'
import { body, header, param } from 'express-validator'
import { CreateKillRecord, CheckServerToken } from '../db/db'
import { validateErrors } from '../common'

const router = Router()

//auth middleware
router.post(
  '/*',
  header('authorization')
    .exists({ checkFalsy: true })
    .withMessage('Missing Authorization Header')
    .bail()
    .contains('Bearer')
    .withMessage('Authorization Token is not Bearer'),
  validateErrors,
  async (req, res, next) => {
    if (!req) return res.sendStatus(500)
    if (!req.headers.authorization) return res.sendStatus(403)
    const query = await CheckServerToken(req.headers.authorization.split(' ')[1])
    if (!query || !query.id) return res.sendStatus(403)
    next()
  }
)

//Route to check auth
router.post('/', (req, res) => {
  res.sendStatus(200)
})

const serversCount: { [id: string]: number } = {}
const serversTimeout: { [id: string]: NodeJS.Timeout } = {}

//same rate limiting code as register. max 10 kills per server every 1 sec. should be enough.
/*router.post('/kill', (req, res, next) => {
  let host = Number(req.query.serverId)
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
})*/

router.post(
  '/kill',
  body([
    'attacker_current_weapon_mods',
    'attacker_weapon_1_mods',
    'attacker_weapon_2_mods',
    'attacker_weapon_3_mods',
    'attacker_offhand_weapon_1',
    'attacker_offhand_weapon_2',
    'victim_current_weapon_mods',
    'victim_weapon_1_mods',
    'victim_weapon_2_mods',
    'victim_weapon_3_mods',
    'victim_offhand_weapon_1',
    'victim_offhand_weapon_2'
  ]).customSanitizer((value) => {
    if (isNaN(value) || !value) {
      value = 0
    }
    return value
  }),
  body([
    'attacker_current_weapon_mods',
    'attacker_weapon_1_mods',
    'attacker_weapon_2_mods',
    'attacker_weapon_3_mods',
    'attacker_offhand_weapon_1',
    'attacker_offhand_weapon_2',
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
  body(['distance', 'player_count'])
    .toInt()
    .isInt()
    .withMessage('must be a valid int'),
  body(['distance', 'game_time'])
    .toFloat()
    .isFloat()
    .withMessage('must be a valid float'),
  body(
    [
      'servername',
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
  body('servername').customSanitizer(e => e.replace(/[^a-z0-9]/gi, '')),
  validateErrors,
  async (req, res) => {
    if (!req.headers.authorization) return res.sendStatus(403)
    const query = (await CheckServerToken(req.headers.authorization.split(' ')[1]))
    if (!query) return
    const host = query.id
    const {
      servername,
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
      servername,
      host,
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
        res.sendStatus(201)
        console.log(
          `[${Date.now().toLocaleString()}] Kill submitted for server ${servername}, ${attacker_name} killed ${victim_name}`
        )
      })
      .catch((e) => {
        res.sendStatus(500)
        console.log({
          killstat_version,
          servername,
          host,
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
        console.error(e)
      })
  }
)
export default router
