import { Router } from 'express'
import db, { CreateKillRecord, FindServer } from './db/db'
import { body, validationResult } from 'express-validator'
import { GetRequest } from './common'
const router = Router()

const verificationString = 'I am a northstar server!'
const masterServerURL = 'https://northstar.tf'
//auth middleware, maybe some timeout ?
router.post('/*', (req, res, next) => {
  next()
})

router.post(
  '/servers/register',
  body(['name', 'description']).isString(),
  body('auth_endpoint').isURL(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(JSON.stringify(errors))
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      //Check if server name isn't already in database
      if (await FindServer(req.body.name)) {
        return res
          .status(403)
          .json({ error: 'Server already exists in the database' })
      }

      //Check if server is in masterserver's list
      const masterServerList = JSON.parse(
        await GetRequest(masterServerURL + '/client/servers')
      ) as Array<any>
      if (!masterServerList.find((e) => e.name == req.body.name)) {
        return res
          .status(403)
          .json({ error: 'Server not listed in masterserver' })
      }

      //Send request to verify server. Not very useful for now, but maybe a future method for auth ?
      if ((await GetRequest(req.body.auth_endpoint)) != verificationString) {
        //Maybe should set a blacklist here for local domain ?
        return res.status(400).json({ error: "Couldn't verify gameserver" })
      }
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        error: "Server encountered an error, Couldn't verify gameserver"
      })
    }
    //register server here
  }
)

router.post(
  '/servers/:serverId/kill',
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
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(JSON.stringify(errors))
      return res.status(400).json({ errors: errors.array() })
    }
    const server = 1 // set server ID here
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
      server,
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
        res.send(200)
      })
      .catch((e) => {
        res.send(500)
      })
  }
)
export default router
