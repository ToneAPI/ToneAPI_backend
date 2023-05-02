import { Kysely, sql } from 'kysely'
import { Client } from 'pg'

const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

const weapons = {
  titan_sword: 'melee_titan_sword',
  yh803_bullet: 'mp_weapon_yh803_bullet',
  titan_punch_scorch: 'melee_titan_punch_scorch',
  titan_punch_tone: 'melee_titan_punch_tone',
  titan_punch_ion: "melee_titan_punch_ion",
  titan_punch_vanguard: "melee_titan_punch_vanguard",
  titan_punch_legion: "melee_titan_punch_legion",
  titan_punch_northstar: "melee_titan_punch_northstar",
}

export async function up(db: Kysely<any>): Promise<void> {
  await pgClient.connect()
  await Promise.all(
    Object.entries(weapons).map(async (e) => {
      console.log('update ' + e[0])
      await pgClient.query(
        `UPDATE KILL SET cause_of_death = '${e[1]}' WHERE cause_of_death = '${e[0]}';`
      )
      await pgClient.query(
        `UPDATE KILL SET attacker_current_weapon = '${e[1]}' WHERE attacker_current_weapon = '${e[0]}';`
      )
      await pgClient.query(
        `UPDATE KILL SET attacker_weapon_1 = '${e[1]}' WHERE attacker_weapon_1 = '${e[0]}';`
      )
      await pgClient.query(
        `UPDATE KILL SET attacker_weapon_2 = '${e[1]}' WHERE attacker_weapon_2 = '${e[0]}';`
      )
      await pgClient.query(
        `UPDATE KILL SET attacker_weapon_3 = '${e[1]}' WHERE attacker_weapon_3 = '${e[0]}';`
      )
      await pgClient.query(
        `UPDATE KILL SET victim_current_weapon = '${e[1]}' WHERE victim_current_weapon = '${e[0]}';`
      )
      await pgClient.query(
        `UPDATE KILL SET victim_weapon_1 = '${e[1]}' WHERE victim_weapon_1 = '${e[0]}';`
      )
      await pgClient.query(
        `UPDATE KILL SET victim_weapon_2 = '${e[1]}' WHERE victim_weapon_2 = '${e[0]}';`
      )
      await pgClient.query(
        `UPDATE KILL SET victim_weapon_3 = '${e[1]}' WHERE victim_weapon_3 = '${e[0]}';`
      )
      console.log('weapon ' + e[1] + ' updated')
    })
  )

  console.log('end')

  //Update the hosts column once the hoster table is manually updated
  await pgClient.end()
}

export async function down(db: Kysely<any>): Promise<void> { }
