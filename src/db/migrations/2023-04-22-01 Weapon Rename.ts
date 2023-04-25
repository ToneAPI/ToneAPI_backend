import { Kysely, sql } from 'kysely'
import { Client } from 'pg'

const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

const weapons = [
  'car',
  'alternator_smg',
  'hemlok_smg',
  'r97',
  'hemlok',
  'vinson',
  'g2',
  'rspn101',
  'rspn101_og',
  'esaw',
  'lstar',
  'lmg',
  'shotgun',
  'mastiff',
  'dmr',
  'sniper',
  'doubletake',
  'pulse_lmg',
  'smr',
  'softball',
  'epg',
  'shotgun_pistol',
  'wingman_n',
  'autopistol',
  'semipistol',
  'wingman',
  'mgl',
  'arc_launcher',
  'rocket_launcher',
  'defender', 'grenade_sonar', 'thermite_grenade', 'grenade_emp', 'smart_pistol', 'satchel', 'grenade_electric_smoke', 'frag_grenade', 'grenade_gravity', 'turretplasma',
]

export async function up(db: Kysely<any>): Promise<void> {
  await pgClient.connect()
  await Promise.all(weapons.map(async (e) => {
    console.log('update ' + e)
    await pgClient.query(
      `UPDATE KILL SET cause_of_death = 'mp_weapon_${e}' WHERE cause_of_death = '${e}';`
    )
    await pgClient.query(
      `UPDATE KILL SET attacker_current_weapon = 'mp_weapon_${e}' WHERE attacker_current_weapon = '${e}';`
    )
    await pgClient.query(
      `UPDATE KILL SET attacker_weapon_1 = 'mp_weapon_${e}' WHERE attacker_weapon_1 = '${e}';`
    )
    await pgClient.query(
      `UPDATE KILL SET attacker_weapon_2 = 'mp_weapon_${e}' WHERE attacker_weapon_2 = '${e}';`
    )
    await pgClient.query(
      `UPDATE KILL SET attacker_weapon_3 = 'mp_weapon_${e}' WHERE attacker_weapon_3 = '${e}';`
    )
    await pgClient.query(
      `UPDATE KILL SET victim_current_weapon = 'mp_weapon_${e}' WHERE victim_current_weapon = '${e}';`
    )
    await pgClient.query(
      `UPDATE KILL SET victim_weapon_1 = 'mp_weapon_${e}' WHERE victim_weapon_1 = '${e}';`
    )
    await pgClient.query(
      `UPDATE KILL SET victim_weapon_2 = 'mp_weapon_${e}' WHERE victim_weapon_2 = '${e}';`
    )
    await pgClient.query(
      `UPDATE KILL SET victim_weapon_3 = 'mp_weapon_${e}' WHERE victim_weapon_3 = '${e}';`
    )
    console.log('weapon ' + e + ' updated')
  }))

  console.log('end')

  //Update the hosts column once the hoster table is manually updated
  await pgClient.end()
}

export async function down(db: Kysely<any>): Promise<void> { }
