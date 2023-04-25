import { Kysely, sql } from 'kysely'
import { Client } from 'pg'

const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

export async function up(db: Kysely<any>): Promise<void> {
  await pgClient.connect()
  await pgClient.query(`ALTER TABLE kill ADD COLUMN IF NOT EXISTS attacker_titan character varying NULL;`)
  await pgClient.query(`UPDATE kill SET attacker_titan = 'scorch' WHERE (cause_of_death = 'mp_titancore_flame_wave_secondary' OR cause_of_death = 'mp_titancore_flame_wave' OR cause_of_death = 'mp_titancore_flame_wall' OR cause_of_death = 'mp_titanweapon_meteor_thermite' OR cause_of_death = 'mp_titanweapon_heat_shield' OR cause_of_death = 'titan_punch_scorch' OR cause_of_death = 'mp_titanweapon_meteor')`)
  await pgClient.query(`UPDATE kill SET attacker_titan = 'ronin' WHERE (cause_of_death = 'mp_titanweapon_arc_wave' OR cause_of_death = 'mp_titancore_shift_core' OR cause_of_death = 'titan_sword' OR cause_of_death = 'mp_titanweapon_leadwall')`)
  await pgClient.query(`UPDATE kill SET attacker_titan = 'ion' WHERE (cause_of_death = 'titan_punch_ion' OR cause_of_death = 'mp_titanweapon_vortex_shield_ion' OR cause_of_death = 'mp_titancore_laser_cannon' OR cause_of_death = 'mp_titanability_laser_trip' OR cause_of_death = 'mp_titanweapon_laser_lite')`)
  await pgClient.query(`UPDATE kill SET attacker_titan = 'tone' WHERE (cause_of_death = 'mp_titancore_salvo_core' OR cause_of_death = 'titan_punch_tone' OR cause_of_death = 'mp_titanweapon_salvo_rockets' OR cause_of_death = 'mp_titanweapon_sticky_40mm')`)
  await pgClient.query(`UPDATE kill SET attacker_titan = 'northstar' WHERE (cause_of_death = 'mp_titanability_slow_trap' OR cause_of_death = 'mp_titanweapon_flightcore_rockets' OR cause_of_death = 'titan_punch_northstar' OR cause_of_death = 'mp_titanweapon_sniper')`)
  await pgClient.query(`UPDATE kill SET attacker_titan = 'legion' WHERE (cause_of_death = 'titan_punch_legion' OR cause_of_death = 'mp_titanweapon_predator_cannon')`)
  await pgClient.query(`UPDATE kill SET attacker_titan = 'vanguard' WHERE (cause_of_death = 'mp_titanweapon_dumbfire_rockets' OR cause_of_death = 'titan_punch_vanguard' OR cause_of_death = 'mp_titanweapon_tracker_rockets' OR cause_of_death = 'mp_titanweapon_particle_accelerator' OR cause_of_death = 'mp_titanweapon_xo16_vanguard')`)
  await pgClient.query(`ALTER TABLE kill ADD COLUMN IF NOT EXISTS victim_titan character varying NULL;`)
  //Update the hosts column once the hoster table is manually updated
  await pgClient.end()
}

export async function down(db: Kysely<any>): Promise<void> {
  await pgClient.connect()
  pgClient.query('ALTER TABLE kill DROP COLUMN IF EXISTS attacker_titan')
  pgClient.query('ALTER TABLE kill DROP COLUMN IF EXISTS victim_titan')
  await pgClient.end()
}
