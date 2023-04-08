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
  test('server auth prefetch', async () => {
    const response = await fetch(`http://127.0.0.1:3001/${process.env.SERVERAUTH_ID}`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Basic ${Buffer.from(process.env.SERVERAUTH_ID + ':' + process.env.SERVERAUTH_TOKEN).toString('base64')}`
      }
    });
    expect(response.status).toBe(200)
  })

  test('register a kill', async () => {
    const data = {
      attacker_weapon_1_mods: 0,
      victim_id: '0',
      victim_name: 'TestVictim',
      victim_offhand_weapon_2: 0,
      attacker_offhand_weapon_3: '0',
      victim_weapon_3_mods: 0,
      attacker_weapon_2_mods: 0,
      attacker_offhand_weapon_1: 0,
      attacker_weapon_3_mods: 0,
      attacker_offhand_weapon_2: 0,
      victim_offhand_weapon_3: '0',
      victim_offhand_weapon_1: 0,
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
      attacker_name: 'TestAttacker'
    }
    const response = await fetch(`http://127.0.0.1:3001/${process.env.SERVERAUTH_ID}/kill`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Basic ${Buffer.from(process.env.SERVERAUTH_ID + ':' + process.env.SERVERAUTH_TOKEN).toString('base64')}`
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    expect(response.status).toBe(201)
  })


  test('register a kill with missing data', async () => {
    const data = {
      attacker_weapon_1_mods: NaN,
      victim_id: '0',
      victim_name: 'TestVictim',
      victim_offhand_weapon_2: NaN,
      attacker_offhand_weapon_3: 'null',
      victim_weapon_3_mods: 19,
      attacker_weapon_2_mods: NaN,
      attacker_offhand_weapon_1: NaN,
      attacker_weapon_3_mods: NaN,
      attacker_offhand_weapon_2: NaN,
      victim_offhand_weapon_3: '0',
      victim_offhand_weapon_1: 1,
      attacker_weapon_3: 'null',
      killstat_version: 'ks_3.0.0',
      attacker_weapon_1: 'null',
      match_id: '554fa7a3',
      distance: 202,
      victim_current_weapon: 'car',
      cause_of_death: 'satchel',
      victim_weapon_2_mods: NaN,
      victim_current_weapon_mods: NaN,
      attacker_current_weapon_mods: NaN,
      game_time: 516.417,
      player_count: 13,
      attacker_current_weapon: 'null',
      attacker_id: '1',
      game_mode: 'ps',
      map: 'grave',
      attacker_weapon_2: 'null',
      victim_weapon_1: 'car',
      victim_weapon_2: 'autopistol',
      victim_weapon_1_mods: NaN,
      victim_weapon_3: 'arc_launcher',
      attacker_name: 'TestAttacker'
    }
    const response = await fetch(`http://127.0.0.1:3001/${process.env.SERVERAUTH_ID}/kill`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Basic ${Buffer.from(process.env.SERVERAUTH_ID + ':' + process.env.SERVERAUTH_TOKEN).toString('base64')}`
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    expect(response.status).toBe(201)
  })
})

afterAll((done) => {
  listenServer.close(() => {
    db.deleteFrom('kill').where('attacker_id', '=', '0').orWhere('attacker_id', '=', '1').execute().then(() => {
      db.destroy().then(() => { done() })
    })
  })
})