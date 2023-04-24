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
  await pgClient.query(
    `ALTER TABLE kill RENAME attacker_offhand_weapon_3 TO victim_offhand_weapon_3_mods;`
  )
  await pgClient.query(
    `ALTER TABLE kill RENAME attacker_offhand_weapon_2 TO victim_offhand_weapon_2_mods;`
  )
  await pgClient.query(
    `ALTER TABLE kill RENAME attacker_offhand_weapon_1 TO victim_offhand_weapon_1_mods;`
  )
  await pgClient.query(
    `ALTER TABLE kill RENAME victim_offhand_weapon_3 TO victim_offhand_weapon_3_mods;`
  )
  await pgClient.query(
    `ALTER TABLE kill RENAME victim_offhand_weapon_2 TO victim_offhand_weapon_2_mods;`
  )
  await pgClient.query(
    `ALTER TABLE kill RENAME victim_offhand_weapon_1 TO victim_offhand_weapon_1_mods;`
  )

  await pgClient.query(`ALTER TABLE kill ADD COLUMN IF NOT EXISTS victim_offhand_weapon_1 character varying NULL;`)
  await pgClient.query(`ALTER TABLE kill ADD COLUMN IF NOT EXISTS victim_offhand_weapon_2 character varying NULL;`)
  await pgClient.query(`ALTER TABLE kill ADD COLUMN IF NOT EXISTS victim_offhand_weapon_3 character varying NULL;`)
  await pgClient.query(`ALTER TABLE kill ADD COLUMN IF NOT EXISTS attacker_offhand_weapon_1 character varying NULL;`)
  await pgClient.query(`ALTER TABLE kill ADD COLUMN IF NOT EXISTS attacker_offhand_weapon_2 character varying NULL;`)
  await pgClient.query(`ALTER TABLE kill ADD COLUMN IF NOT EXISTS attacker_offhand_weapon_3 character varying NULL;`)
  //Update the hosts column once the hoster table is manually updated
  await pgClient.end()
}

export async function down(db: Kysely<any>): Promise<void> { }
