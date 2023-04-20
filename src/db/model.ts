import { ColumnType, Generated } from 'kysely'

export interface KillTable {
  id: Generated<number>
  servername: string
  host: number
  killstat_version: string
  match_id: string
  game_mode: string
  map: string
  unix_time: Generated<Date>
  game_time: number
  player_count: number
  attacker_name: string
  attacker_id: string
  attacker_current_weapon: string
  attacker_current_weapon_mods: number
  attacker_weapon_1: string
  attacker_weapon_1_mods: number
  attacker_weapon_2: string
  attacker_weapon_2_mods: number
  attacker_weapon_3: string
  attacker_weapon_3_mods: number
  attacker_offhand_weapon_1: number
  attacker_offhand_weapon_2: number
  victim_name: string
  victim_id: string
  victim_current_weapon: string
  victim_current_weapon_mods: number
  victim_weapon_1: string
  victim_weapon_1_mods: number
  victim_weapon_2: string
  victim_weapon_2_mods: number
  victim_weapon_3: string
  victim_weapon_3_mods: string
  victim_offhand_weapon_1: number
  victim_offhand_weapon_2: number
  cause_of_death: string
  distance: number
  titan?: string
}
/*
interface PlayerTable {
  id: number
  name: string
  'opt-out': boolean
  hide_TOS: boolean
}
*/

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
interface HosterTable {
  id: Generated<number>
  name: string
  token: Generated<string>
}
interface Database {
  kill: KillTable
  //player: PlayerTable
  weapon: WeaponTable
  maps: MapTable
  host: HosterTable
}

export default Database
