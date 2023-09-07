import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import serverMain from '../src/serverMain'
import db, { dbReady } from '../src/db'
import * as dotenv from 'dotenv'
import { type MatchCloseData, type KillData } from '../src/types'
dotenv.config()

let listenServer

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${Buffer.from(process.env.SERVERAUTH_TOKEN + '').toString('base64')}`
}
const testMatch = { air_accel: false, server_name: 'servertest' + Math.floor(Math.random() * 100).toString(), game_map: 'testMap', gamemode: 'test' }
const testKill: KillData = {
  game_time: 22.61666870117186,
  player_count: 1,
  match_id: 1,
  victim: {
    velocity: 0.0,
    name: 'Legonzaur',
    loadout: {
      titan: 'testTitan',
      passive1: 'testPassive1',
      passive2: 'testPassive2',
      ordnance: {
        id: 'mp_weapon_satchel',
        mods: 0
      },
      secondary: {
        id: 'mp_weapon_wingman',
        mods: 140
      },
      primary: {
        id: 'mp_weapon_sniper',
        mods: 1168
      },
      tactical: {
        id: 'mp_ability_grapple',
        mods: 8
      },
      anti_titan: {
        id: 'mp_weapon_defender',
        mods: 134
      }
    },
    current_weapon: {
      id: 'mp_weapon_sniper',
      mods: 1168
    },
    state: 'OnGround',
    id: '1005930844007',
    cloaked: false
  },
  attacker: {
    velocity: 0.0,
    name: 'Legonzaur',
    loadout: {
      titan: 'testTitan',
      passive1: 'testPassive1',
      passive2: 'testPassive2',
      ordnance: {
        id: 'mp_weapon_satchel',
        mods: 0
      },
      secondary: {
        id: 'mp_weapon_wingman',
        mods: 140
      },
      primary: {
        id: 'mp_weapon_sniper',
        mods: 1168
      },
      tactical: {
        id: 'mp_ability_grapple',
        mods: 8
      },
      anti_titan: {
        id: 'mp_weapon_defender',
        mods: 134
      }
    },
    current_weapon: {
      id: 'mp_weapon_sniper',
      mods: 1168
    },
    state: 'OnGround',
    id: '1005930844007',
    cloaked: false
  },
  distance: 0.0,
  cause_of_death: 'mp_weapon_satchel'
}

const testMatchStats: MatchCloseData = {
  1005930844007: {
    stats: {
      distance: {
        air: 122.2,
        ground: 50.4,
        wall: 20.1
      },
      time: {
        air: 1220.2,
        ground: 500.4,
        wall: 200.1
      }
    },
    weapons: {
      mp_testweapon: {
        playtime: 1569.1,
        shotsCrit: 15,
        shotsFired: 5,
        shotsHeadshot: 9,
        shotsHit: 4,
        shotsRichochet: 0
      }
    },
    titans: {
      testTitan: {
        playtime: 1569.1,
        shotsCrit: 15,
        shotsFired: 5,
        shotsHeadshot: 9,
        shotsHit: 4,
        shotsRichochet: 0
      }
    }
  }
}

beforeAll(async () => {
  listenServer = await serverMain
  await dbReady()
})

describe('auth', () => {
  test('bad auth prefetch', async () => {
    const response = await fetch('http://127.0.0.1:3001/', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearere ${Buffer.from('' + process.env.SERVERAUTH_TOKEN).toString('base64')}`
      }
    })
    expect(response.status).toBe(400)

    const response2 = await fetch('http://127.0.0.1:3001/', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Buffer.from('badtoken').toString('base64')}`
      }
    })
    expect(response2.status).toBe(401)
  })

  test('bad kill token', async () => {
    const response2 = await fetch('http://127.0.0.1:3001/kill', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Buffer.from('badtoken').toString('base64')}`
      }
    })
    expect(response2.status).toBe(401)
  })

  test('good auth prefetch', async () => {
    const response = await fetch('http://127.0.0.1:3001/', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers
    })
    expect(response.status).toBe(200)
  })
})

describe('stats', () => {
  let matchId: string
  test('register a match', async () => {
    const response = await fetch('http://127.0.0.1:3001/match', {
      method: 'POST',
      headers,
      body: JSON.stringify(testMatch)
    })
    const json = await response.json()
    matchId = json.match
    testKill.match_id = Number(matchId)
    expect(json).toHaveProperty('match')
    expect(json.match).not.toBeNaN()
    expect(response.status).toBe(201)
  })

  test('register a player', async () => {
    const response = await fetch(`http://127.0.0.1:3001/player/${testKill.attacker.id}/connect`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ username: 'Legonzaur', match_id: testKill.match_id })
    })
    console.log(await response.text())
    expect(response.status).toBe(200)
  })

  test('register a kill', async () => {
    const response = await fetch('http://127.0.0.1:3001/kill', {
      method: 'POST',
      headers,
      body: JSON.stringify(testKill)
    })
    console.log(await response.text())
    expect(response.status).toBe(201)
  })

  // test('register a kill with missing data', async () => {
  //   const data = testKill
  //   const response = await fetch('http://127.0.0.1:3001/kill', {
  //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
  //     credentials: 'same-origin', // include, *same-origin, omit
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${Buffer.from(process.env.SERVERAUTH_TOKEN + '').toString('base64')}`
  //     },
  //     body: JSON.stringify(data)
  //   })
  //   expect(response.status).toBe(400)
  // })

  test('close a match', async () => {
    const response = await fetch(`http://127.0.0.1:3001/match/${matchId}/close`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testMatchStats)
    })
    expect(response.status).toBe(201)
  })

  test('register a kill after a match is closed', async () => {
    const response = await fetch('http://127.0.0.1:3001/kill', {
      method: 'POST',
      headers,
      body: JSON.stringify(testKill)
    })
    expect(response.status).toBe(409)
  })
})

afterAll((done) => {
  // db.deleteFrom('kill').where('attacker_id', '=', 0n).orWhere('attacker_id', '=', 1n).execute().then(() => {
  listenServer.close(async () => {
    await db.destroy()
    done()
  })
  // })
})
