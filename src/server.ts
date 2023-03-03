import { Router } from 'express'
import db, { CreateKillRecord } from './db/db'
import { body } from 'express-validator'
const router = Router()

//auth middleware, maybe some timeout ?
router.post('/*', (req, res, next) => {
  next()
})
router.post(
  '/servers/:serverId/kills',
  body(
    ['attacker_id', 'victim_id'],
    'attacker and victim must be player UIDs'
  ).isInt(),
  body(
    [
      'tone_version',
      'match_id',
      'game_mode',
      'map',
      'player_count',
      'attacker_name',
      'attacker_current_weapon',
      'attacker_current_weapon_mods',
      'attacker_weapon_1',
      'attacker_weapon_1_mods',
      'attacker_weapon_2',
      'attacker_weapon_2_mods',
      'attacker_weapon_3',
      'attacker_weapon_3_mods',
      'attacker_offhand_weapon_1',
      'attacker_offhand_weapon_2',
      'victim_name',
      'victim_current_weapon',
      'victim_current_weapon_mods',
      'victim_weapon_1',
      'victim_weapon_1_mods',
      'victim_weapon_2',
      'victim_weapon_2_mods',
      'victim_weapon_3',
      'victim_weapon_3_mods',
      'victim_offhand_weapon_1',
      'victim_offhand_weapon_2',
      'cause_of_death'
    ],
    'values must be composed of a maximum of 50 valid ascii characters'
  )
    .isString()
    .isLength({ max: 50 })
    .isAscii(),
  body(
    ['distance', 'game_time'],
    'distance and game_time must be postitive floats'
  ).isFloat({
    min: 0
  }),
  body(
    ['cause_of_death', 'victim_id'],
    'cause_of_death and victim_id are mandatory'
  ).notEmpty(),
  (req, res, next) => {
    const server = 1 // set server ID here
    const {
      tone_version,
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
      tone_version,
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
    res.send(200)
  }
)
export default router
