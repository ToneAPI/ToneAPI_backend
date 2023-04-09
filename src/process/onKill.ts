import { Client } from 'pg'
import client from '../cache/redis'

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
        console.log(JSON.parse(data.payload))

        await updateGlobal(payload)

    })
}

async function updateGlobal({ cause_of_death, distance, attacker_id, victim_id, server }: { cause_of_death: string, distance: number, attacker_id: string, victim_id: string, server: number }) {
    const promises: Promise<any>[] = []

    promises.push(updatePath(`data`, { distance }))
    //servers.1
    promises.push(updatePath(`servers.${server}`, { distance }).then(() => Promise.all([
        //servers.1.players.123456789
        updatePath(`servers.${server}.players.${attacker_id}`, { distance }).then(() =>
            //servers.1.players.123456789.weapons.epg
            updatePath(`servers.${server}.players.${attacker_id}.weapons.${cause_of_death}`, { distance })
        ),
        //servers.1.weapons.epg
        updatePath(`servers.${server}.weapons.${cause_of_death}`, { distance }).then(() =>
            //servers.1.weapons.epg.players.123456789
            updatePath(`servers.${server}.weapons.${cause_of_death}.players.${attacker_id}`, { distance })
        )])
    ))


    //players.123456789
    promises.push(updatePath(`players.${attacker_id}`, { distance }).then(async () => {
        await client.json.numIncrBy('kills', `players.${victim_id}.deaths`, 1)
        //players.123456789.weapons.epg
        await updatePath(`players.${attacker_id}.weapons.${cause_of_death}`, { distance })
        return await client.json.numIncrBy('kills', `server.${server}.players.${victim_id}.deaths`, 1)
    }))


    //weapons.epg
    promises.push(updatePath(`weapons.${cause_of_death}`, { distance }).then(() =>
        //weapons.epg.players.123456789
        updatePath(`weapons.${cause_of_death}.players.${attacker_id}`, { distance })
    ))


    await Promise.all(promises)
}

async function updatePath(path: string, { distance }: { distance: number }) {
    if (!await client.json.type('kills', path)) await client.json.set('kills', path, {})
    let transaction = client.multi()
    transaction = transaction.json.numIncrBy('kills', `${path}.total_distance`, distance)
    let max_distance = Number(await client.json.get('kills', { path: `${path}.max_distance` }))
    if (isNaN(max_distance) || max_distance < distance) transaction = transaction.json.set('kills', `${path}.max_distance`, distance)
    transaction = transaction.json.numIncrBy('kills', `${path}.kills`, 1)
    return transaction.exec()
}