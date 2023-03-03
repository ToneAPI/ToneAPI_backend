import { ColumnType, Generated } from 'kysely'

export interface KillTable {
  id: Generated<number>
  server: number
  tone_version: string
  match_id: string
  game_mode: string
  map: string
  unix_time: Generated<Date>
  game_time: number
  player_count: number
  attacker_name: string
  attacker_id: number
  attacker_current_weapon: string
  attacker_current_weapon_mods: string
  attacker_weapon_1: string
  attacker_weapon_1_mods: string
  attacker_weapon_2: string
  attacker_weapon_2_mods: string
  attacker_weapon_3: string
  attacker_weapon_3_mods: string
  attacker_offhand_weapon_1: string
  attacker_offhand_weapon_2: string
  victim_name: string
  victim_id: number
  victim_current_weapon: string
  victim_current_weapon_mods: string
  victim_weapon_1: string
  victim_weapon_1_mods: string
  victim_weapon_2: string
  victim_weapon_2_mods: string
  victim_weapon_3: string
  victim_weapon_3_mods: string
  victim_offhand_weapon_1: string
  victim_offhand_weapon_2: string
  cause_of_death: string
  distance: number
}

interface PlayerTable {
  id: number
  name: string
  'opt-out': boolean
  hide_TOS: boolean
}
interface WeaponTable {
  id: string
  name: string
  description: string
  image: string
}
interface MapTable {
  id: string
  name: string
  description: string
  image: string
}
interface ServerTable {
  id: string
  name: string
  description: string
}
interface Database {
  kill: KillTable
  player: PlayerTable
  weapon: WeaponTable
  maps: MapTable
  server: ServerTable
}

export default Database
