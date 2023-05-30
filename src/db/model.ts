import { type Generated } from 'kysely'

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
  attacker_offhand_weapon_1: string
  attacker_offhand_weapon_1_mods: number
  attacker_offhand_weapon_2: string
  attacker_offhand_weapon_2_mods: number
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
  victim_offhand_weapon_1: string
  victim_offhand_weapon_1_mods: number
  victim_offhand_weapon_2: string
  victim_offhand_weapon_2_mods: number
  cause_of_death: string
  distance: number
  titan?: string
}

export interface KillViewTable {
  kills: number
  deaths: number
  deaths_with_weapon: number
  attacker_id: number
  attacker_name: string
  map: string
  game_mode: string
  cause_of_death: string
  servername: string
  host: number
  max_distance: number
  total_distance: number
}

interface HosterTable {
  id: Generated<number>
  name: string
  token: Generated<string>
}
interface Database {
  kill_view: KillViewTable
  kill: KillTable
  host: HosterTable
}

export default Database
