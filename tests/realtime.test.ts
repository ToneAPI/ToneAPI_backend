import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals'
import clientMain from '../src/clientMain'
import serverMain from '../src/serverMain'
import { pgClient } from '../src/process/onKill'
import * as dotenv from 'dotenv'
import db from '../src/db/db'
dotenv.config()

let listenClient
let listenServer

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

function waitFor(time: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    })
}

jest.setTimeout(30000)

beforeAll(async () => {
    listenClient = await clientMain;
    listenServer = await serverMain;
    const yea = waitFor(1000)
    const response = await fetch(`http://127.0.0.1:3001/kill`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${Buffer.from('' + process.env.SERVERAUTH_TOKEN).toString('base64')}`
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    expect(response.status).toBe(201)
    await yea
})

describe('realtime', () => {
    let playerKills
    let weaponKills
    let playerDeaths
    let serverKills
    test('fetch player', async () => {
        const request = await fetch("http://127.0.0.1:3000/players")
        const data = await request.json()
        const player = data["1"]
        expect(player).toHaveProperty('max_distance')
        expect(player).toHaveProperty('total_distance')
        expect(player).toHaveProperty('kills')
        playerKills = player.kills
        playerDeaths = player.deaths
    })

    test('fetch weapon', async () => {
        const request = await fetch("http://127.0.0.1:3000/weapons")
        const data = await request.json()
        const weapon = data.smr
        expect(weapon).toHaveProperty('max_distance')
        expect(weapon).toHaveProperty('total_distance')
        expect(weapon).toHaveProperty('kills')
        weaponKills = weapon.kills
    })

    test('fetch server', async () => {
        const request = await fetch("http://127.0.0.1:3000/servers")
        const data = await request.json()
        const server = data.testserver
        expect(server).toHaveProperty('kills')
        serverKills = server.kills
    })

    test('update player', async () => {
        jest.setTimeout(15000)
        const yea = waitFor(1000)
        const response = await fetch(`http://127.0.0.1:3001/kill`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${Buffer.from('' + process.env.SERVERAUTH_TOKEN).toString('base64')}`
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        expect(response.status).toBe(201)
        await yea
    })

    test('check player update', async () => {
        const request = await fetch("http://127.0.0.1:3000/players")
        const data = await request.json()
        const player = data["1"]
        expect(player.kills).toBe(playerKills + 1)
    })

    test('check weapon update', async () => {
        const request = await fetch("http://127.0.0.1:3000/weapons")
        const data = await request.json()
        const weapon = data.smr
        expect(weapon.kills).toBe(weaponKills + 1)
    })

    test('check server update', async () => {
        const request = await fetch("http://127.0.0.1:3000/servers")
        const data = await request.json()
        const server = data.testserver
        expect(server.kills).toBe(serverKills + 1)
    })

})

afterAll((done) => {
    listenClient.close(() => {
        listenServer.close(async () => {
            await pgClient.end()
            await db.destroy()
            done()
        })
    })
})