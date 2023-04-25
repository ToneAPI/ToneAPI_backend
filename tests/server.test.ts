import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import serverMain from '../src/serverMain'
import db from "../src/db/db"
import * as dotenv from 'dotenv'
dotenv.config()

let listenServer

beforeAll(async () => {
  listenServer = await serverMain;
})

describe('server', () => {

  test('bad auth prefetch', async () => {
    const response = await fetch(`http://127.0.0.1:3001/`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearere ${Buffer.from('' + process.env.SERVERAUTH_TOKEN).toString('base64')}`
      }
    });
    expect(response.status).toBe(400)

    const response2 = await fetch(`http://127.0.0.1:3001/`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Buffer.from('badtoken').toString('base64')}`
      }
    });
    expect(response2.status).toBe(403)
  })

  test('bad kill token', async () => {
    const response2 = await fetch(`http://127.0.0.1:3001/kill`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Buffer.from('badtoken').toString('base64')}`
      }
    });
    expect(response2.status).toBe(403)
  })


  test('good auth prefetch', async () => {
    const response = await fetch(`http://127.0.0.1:3001/`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Buffer.from('' + process.env.SERVERAUTH_TOKEN).toString('base64')}`
      }
    });
    expect(response.status).toBe(200)
  })

  test('register a kill', async () => {
    const data = {
      servername: 'testserver',
      attacker_weapon_1_mods: 0,
      victim_id: '0',
      victim_name: 'TestVictim',
      victim_offhand_weapon_2: 'offhand_weapon_test',
      victim_offhand_weapon_2_mods: 0,
      victim_weapon_3_mods: 0,
      attacker_weapon_2_mods: 0,
      attacker_offhand_weapon_1: 'offhand_weapon_test',
      attacker_offhand_weapon_1_mods: 0,
      attacker_weapon_3_mods: 0,
      attacker_offhand_weapon_2: 'offhand_weapon_test',
      attacker_offhand_weapon_2_mods: 0,
      victim_offhand_weapon_1: 'offhand_weapon_test',
      victim_offhand_weapon_1_mods: 0,
      attacker_weapon_3: 'defender',
      killstat_version: 'ks_3.0.0',
      attacker_weapon_1: 'smr',
      match_id: '31b1f34d',
      distance: 0,
      victim_current_weapon: 'smr',
      cause_of_death: 'smr',
      victim_weapon_2_mods: 0,
      victim_current_weapon_mods: 0,
      attacker_current_weapon_mods: 0,
      game_time: 377.799,
      player_count: 1,
      attacker_current_weapon: 'smr',
      attacker_id: '1',
      game_mode: 'tdm',
      map: 'thaw',
      attacker_weapon_2: 'autopistol',
      victim_weapon_1: 'smr',
      victim_weapon_2: 'autopistol',
      victim_weapon_1_mods: 0,
      victim_weapon_3: 'defender',
      attacker_name: 'TestAttacker',
      victim_titan: 'null',
      attacker_titan: 'null'
    }
    const response = await fetch(`http://127.0.0.1:3001/kill`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Buffer.from(process.env.SERVERAUTH_TOKEN + '').toString('base64')}`
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    console.log(await response.text())
    expect(response.status).toBe(201)
  })


  test('register a kill with missing data', async () => {
    const data = {
      servername: 'testserver',
      attacker_weapon_1_mods: 0,
      victim_id: '0',
      victim_name: 'TestVictim',
      victim_offhand_weapon_2: 'null',
      victim_offhand_weapon_2_mods: 0,
      victim_weapon_3_mods: 0,
      attacker_weapon_2_mods: NaN,
      attacker_offhand_weapon_1: 'null',
      attacker_offhand_weapon_1_mods: 0,
      attacker_weapon_3_mods: NaN,
      attacker_offhand_weapon_2: 'null',
      attacker_offhand_weapon_2_mods: NaN,
      victim_offhand_weapon_1: 'offhand_weapon_test',
      victim_offhand_weapon_1_mods: 0,
      attacker_weapon_3: 'defender',
      killstat_version: 'ks_3.0.0',
      attacker_weapon_1: 'smr',
      match_id: '31b1f34d',
      distance: 0,
      victim_current_weapon: 'smr',
      cause_of_death: 'smr',
      victim_weapon_2_mods: 0,
      victim_current_weapon_mods: 0,
      attacker_current_weapon_mods: 0,
      game_time: 377.799,
      player_count: 1,
      attacker_current_weapon: 'smr',
      attacker_id: '1',
      game_mode: 'tdm',
      map: 'thaw',
      attacker_weapon_2: 'autopistol',
      victim_weapon_1: 'null',
      victim_weapon_2: 'autopistol',
      victim_weapon_1_mods: 0,
      victim_weapon_3: 'defender',
      attacker_name: 'TestAttacker',
      victim_titan: 'null',
      attacker_titan: 'null'
    }
    const response = await fetch(`http://127.0.0.1:3001/kill`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Buffer.from(process.env.SERVERAUTH_TOKEN + '').toString('base64')}`
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    expect(response.status).toBe(201)
  })
})

afterAll((done) => {
  db.deleteFrom('kill').where('attacker_id', '=', '0').orWhere('attacker_id', '=', '1').execute().then(() => {
    listenServer.close(async () => {
      await db.destroy()
      done()
    })
  })
})
