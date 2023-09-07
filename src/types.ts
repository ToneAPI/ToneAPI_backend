import { type RequestHandler, type Request } from 'express'
import type typia from 'typia'

interface WeaponKillData {
  id: string
  mods: number
}

export interface LoadoutKillData {
  ordnance: WeaponKillData | undefined
  secondary: WeaponKillData | undefined
  primary: WeaponKillData | undefined
  tactical: WeaponKillData | undefined
  anti_titan: WeaponKillData | undefined
  passive1: string | undefined
  passive2: string | undefined
  titan: string | undefined
}

interface PlayerKillData {
  velocity: number
  loadout: LoadoutKillData
  current_weapon: WeaponKillData
  state: string
  id: string
  cloaked: boolean
}

export interface MatchData {
  server_name: string
  game_map: string
  gamemode: string
  air_accel: boolean
}

export interface KillData {
  game_time: number
  player_count: number
  match_id: number
  victim: PlayerKillData
  attacker: PlayerKillData
  distance: number
  cause_of_death: string
}

export type MatchCloseData = Record<string, MatchClosePlayerData>
export interface MatchClosePlayerData {
  weapons: Record<string, MatchCloseWeaponData>
  titans: Record<string, MatchCloseWeaponData>
  stats: {
    distance: {
      ground: number
      wall: number
      air: number
    }
    time: {
      ground: number
      wall: number
      air: number
    }
  }
}
export interface MatchCloseWeaponData {
  shotsFired: number
  shotsHit: number
  shotsCrit: number
  shotsHeadshot: number
  shotsRichochet: number
  playtime: number
}

export type RequestBody<T> = Request<any, any, T>

export const validateBody =
  <T>(checker: (input: T) => typia.IValidation<T>): RequestHandler =>
    (req, res, next) => {
      const result: typia.IValidation<T> = checker(req.body)
      if (!result.success) {
        res.status(400).send({ errors: result.errors })
        console.log(req.body)
        console.error(result.errors)
      } else {
        next()
      }
    }
