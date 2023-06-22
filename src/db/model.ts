import { type Generated } from 'kysely'

interface HostTable {
  host_name: string
  host_id: Generated<number>
  host_token: Generated<string>
}

interface ServerTable {
  server_name: string
  host_id: number
}

interface MatchTable {
  match_id: Generated<number>
  host_id: number
  server_name: string
  game_map: string
  gamemode: string
  air_accel: boolean
}

interface PlayerTable {
  weapon_id: string
  weapon_name: string
}

interface WeaponTable {
  playername: string
  player_id: number
}

interface ModsOnWeaponTable {
  mod_id: number
  speedloader: boolean
  extra_ammo: boolean
  gunrunner: boolean
  gun_ready: boolean
  quickswap: boolean
  tactikill: boolean
  suppressor: boolean
  ricochet: boolean
  pro_screen: boolean
}

interface TitanChassisTable {
  titan_id: string
  chassis_name: string
}

interface LoadoutTable {
  loadout_id: Generated<number>
  primary_weapon: string
  secondary_weapon: string
  anti_titan_weapon: string
  primary_mod_id: number
  secondary_mod_id: number
  anti_titan_mod_id: number
  ordnance: string
  tactical: string
  titan_weapon: string
  pilot_passive_1: string
  pilot_passive_2: string
  titan_passive_1: string
  titan_passive_2: string
  titan_passive_3: string
  titan_passive_4: string
  titan_passive_5: string
  titan_passive_6: string
  titan_special: string
  titan_anti_rodeo: string
  titan_primary_mod: string
  titan_id: string
}

export interface KillTable {
  kill_id: Generated<bigint>
  attacker_id: bigint
  victim_id: bigint
  match_id: number
  attacker_loadout_id: number
  victim_loadout_id: number
  attacker_speed: number
  victim_speed: number
  attacker_movementstate: string
  victim_movementstate: string
  distance: number
  unix_time: Date
  game_time: number
  cause_of_death: string
  attacker_held_weapon: string
  victim_held_weapon: string
}

export interface TitanStatsInMatchTable {
  match_id: number
  player_id: bigint
  titan_id: string
  playtime: bigint
  shots_fired: number
  shots_hit: number
  headshots: number
}

export interface WeaponStatsInMatchTable {
  match_id: number
  player_id: bigint
  weapon_id: string
  playtime: bigint
  shots_fired: number
  shots_hit: number
  headshots: number
  ricochets: number
}

export interface PlayerStatsInMatchTable {
  match_id: number
  player_id: bigint
  shots_fired: number
  shots_hit: number
  headshots: number
  ricochets: number
  overall_distance_covered: bigint
  time_grounded: bigint
  time_wall: bigint
  time_air: bigint
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

interface Database {
  kill_view: KillViewTable
  host: HostTable
  server: ServerTable
  match: MatchTable
  player: PlayerTable
  weapon: WeaponTable
  mods_on_weapon: ModsOnWeaponTable
  titan_chassis: TitanChassisTable
  loadout: LoadoutTable
  kill: KillTable
  titan_stats_in_match: TitanStatsInMatchTable
  weapon_stats_in_match: WeaponStatsInMatchTable
  player_stats_in_match: PlayerStatsInMatchTable
}

export default Database
