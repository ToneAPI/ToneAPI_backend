import { Client } from 'pg'
import client from '../cache/redis'
import { genPrefix } from './process'

const pgClient = new Client({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
})

export default async function listenKills() {
    await pgClient.connect()
    await pgClient.query('LISTEN new_kill')

    pgClient.on('notification', async (data) => {
        if (!data.payload) return
        const payload = JSON.parse(data.payload)
        await updateGlobal(payload)
    })
    return pgClient
}


async function updateGlobal({ cause_of_death, distance, attacker_id, victim_id, servername, host }: { cause_of_death: string, distance: number, attacker_id: string, victim_id: string, servername: string, host: number }) {
    servername = servername.replace(/[^a-z0-9]/gi, '')
    const promises: Promise<any>[] = []

    if (!await client.json.type('kills')) await client.json.set('kills', '', { data: {}, weapons: {}, servers: {}, players: {} })

    if (!await client.json.type('kills', genPrefix.weapon({ cause_of_death }))) await client.json.set('kills', genPrefix.weapon({ cause_of_death }), { players: {}, max_distance: 0, kills: 0, total_distance: 0 })
    if (!await client.json.type('kills', genPrefix.player({ attacker_id }))) await client.json.set('kills', genPrefix.player({ attacker_id }), { weapons: {}, max_distance: 0, kills: 0, deaths: 0, total_distance: 0 })
    if (!await client.json.type('kills', `servers.${host}`)) await client.json.set('kills', `servers.${host}`, {})
    if (!await client.json.type('kills', `servers.${host}.${servername}`)) await client.json.set('kills', `servers.${host}.${servername}`, { data: {}, weapons: {}, players: {}, max_distance: 0, kills: 0, total_distance: 0 })
    if (!await client.json.type('kills', genPrefix.weapon({ cause_of_death, server: `${host}.${servername}` }))) await client.json.set('kills', genPrefix.weapon({ cause_of_death, server: `${host}.${servername}` }), { players: {}, max_distance: 0, kills: 0, total_distance: 0 })
    if (!await client.json.type('kills', genPrefix.player({ attacker_id, server: `${host}.${servername}` }))) await client.json.set('kills', genPrefix.player({ attacker_id, server: `${host}.${servername}` }), { weapons: {}, max_distance: 0, kills: 0, deaths: 0, total_distance: 0 })

    if (!await client.json.type('kills', genPrefix.player({ attacker_id: victim_id, server: `${host}.${servername}` }))) await client.json.set('kills', genPrefix.player({ attacker_id: victim_id, server: `${host}.${servername}` }), { weapons: {}, max_distance: 0, kills: 0, deaths: 0, total_distance: 0 })
    if (!await client.json.type('kills', genPrefix.player({ attacker_id: victim_id }))) await client.json.set('kills', genPrefix.player({ attacker_id: victim_id }), { weapons: {}, max_distance: 0, kills: 0, deaths: 0, total_distance: 0 })

    if (!await client.json.type('kills', genPrefix.weaponPlayers({ attacker_id: victim_id, cause_of_death }))) await client.json.set('kills', genPrefix.weaponPlayers({ attacker_id: victim_id, cause_of_death }), { max_distance: 0, kills: 0, deaths: 0, total_distance: 0 })
    if (!await client.json.type('kills', genPrefix.playerWeapons({ attacker_id: victim_id, cause_of_death }))) await client.json.set('kills', genPrefix.playerWeapons({ attacker_id: victim_id, cause_of_death }), { max_distance: 0, kills: 0, total_distance: 0 })

    if (!await client.json.type('kills', genPrefix.weaponPlayers({ attacker_id: victim_id, cause_of_death, server: `${host}.${servername}` }))) await client.json.set('kills', genPrefix.weaponPlayers({ attacker_id: victim_id, cause_of_death, server: `${host}.${servername}` }), { max_distance: 0, kills: 0, deaths: 0, total_distance: 0 })
    if (!await client.json.type('kills', genPrefix.playerWeapons({ attacker_id: victim_id, cause_of_death, server: `${host}.${servername}` }))) await client.json.set('kills', genPrefix.playerWeapons({ attacker_id: victim_id, cause_of_death, server: `${host}.${servername}` }), { max_distance: 0, kills: 0, total_distance: 0 })

    promises.push(updatePath(`data`, { distance }))
    //servers.1
    promises.push(updatePath(`servers.${host}.${servername}`, { distance }).then(() => Promise.all([
        //servers.1.players.123456789
        updatePath(`servers.${host}.${servername}.players.${attacker_id}`, { distance }).then(async () => {
            if (!await client.json.type('kills', `servers.${host}.${servername}.players.${victim_id}.deaths`)) await client.json.set('kills', `servers.${host}.${servername}.players.${victim_id}.deaths`, 0)
            await client.json.numIncrBy('kills', `servers.${host}.${servername}.players.${victim_id}.deaths`, 1)
            //servers.1.players.123456789.weapons.epg
            await updatePath(`servers.${host}.${servername}.players.${attacker_id}.weapons.${cause_of_death}`, { distance })
        }

        ),
        //servers.1.weapons.epg
        updatePath(`servers.${host}.${servername}.weapons.${cause_of_death}`, { distance }).then(async () => {
            //servers.1.weapons.epg.players.123456789
            await updatePath(`servers.${host}.${servername}.weapons.${cause_of_death}.players.${attacker_id}`, { distance })
            if (!await client.json.type('kills', `servers.${host}.${servername}.players.${victim_id}.deaths`)) await client.json.set('kills', `servers.${host}.${servername}.weapons.${cause_of_death}.players.${victim_id}`, 0)
            await client.json.numIncrBy('kills', `servers.${host}.${servername}.weapons.${cause_of_death}.players.${victim_id}.deaths`, 1)
        }

        )])
    ))


    //players.123456789
    promises.push(updatePath(`players.${attacker_id}`, { distance }).then(async () => {
        if (!await client.json.type('kills', `players.${victim_id}.deaths`)) await client.json.set('kills', `players.${victim_id}.deaths`, 0)
        await client.json.numIncrBy('kills', `players.${victim_id}.deaths`, 1)
        //players.123456789.weapons.epg
        await updatePath(`players.${attacker_id}.weapons.${cause_of_death}`, { distance })
    }))


    //weapons.epg
    promises.push(updatePath(`weapons.${cause_of_death}`, { distance }).then(async () => {
        //weapons.epg.players.123456789
        await updatePath(`weapons.${cause_of_death}.players.${attacker_id}`, { distance })
        if (!await client.json.type('kills', `weapons.${cause_of_death}.players.${victim_id}.deaths`)) await client.json.set('kills', `weapons.${cause_of_death}.players.${victim_id}.deaths`, 0)
        await client.json.numIncrBy('kills', `weapons.${cause_of_death}.players.${victim_id}.deaths`, 1)
    }
    ))


    await Promise.all(promises)
}

async function updatePath(path: string, { distance }: { distance: number }) {
    await setupPath(path)
    console.log(path + '.max_distance', await client.json.type('kills', path + '.max_distance'))
    console.log(path, await client.json.type('kills', path))
    if (!await client.json.type('kills', path)) await client.json.set('kills', path, {})
    let transaction = client.multi()
    transaction = transaction.json.numIncrBy('kills', `${path}.total_distance`, distance)
    let max_distance = Number(await client.json.get('kills', { path: `${path}.max_distance` }))
    if (isNaN(max_distance) || max_distance < distance) transaction = transaction.json.set('kills', `${path}.max_distance`, distance)
    transaction = transaction.json.numIncrBy('kills', `${path}.kills`, 1)
    await transaction.exec()
}

async function setupPath(path: string) {
    if (!await client.json.type('kills', path + '.kills')) await client.json.set('kills', path + '.kills', 0)
    if (!await client.json.type('kills', path + '.total_distance')) await client.json.set('kills', path + '.total_distance', 0)
    if (!await client.json.type('kills', path + '.max_distance')) await client.json.set('kills', path + '.max_distance', 0)
}