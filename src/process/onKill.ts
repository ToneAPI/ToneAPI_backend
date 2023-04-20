import { Client } from 'pg'
import { allData } from './process'

const pgClient = new Client({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
})

export default async function listenKills() {
    await pgClient.connect()
    await pgClient.query('LISTEN new_kill')

    pgClient.on('notification', (data) => {
        if (!data.payload) return
        const payload = JSON.parse(data.payload)
        let killEntry = allData.find(
            (e) =>
                e.attacker_id == payload.attacker_id &&
                e.cause_of_death == payload.cause_of_death &&
                e.game_mode == payload.game_mode &&
                e.host == payload.host &&
                e.map == payload.map &&
                e.servername == payload.servername
        )
        let deathEntry = allData.find(
            (e) =>
                e.attacker_id == payload.victim_id &&
                e.cause_of_death == payload.cause_of_death &&
                e.game_mode == payload.game_mode &&
                e.host == payload.host &&
                e.map == payload.map &&
                e.servername == payload.servername
        )
        if (!killEntry) {
            killEntry = {
                kills: 0,
                deaths: 0,
                max_distance: 0,
                total_distance: 0,
                attacker_name: payload.attacker_name,
                attacker_id: payload.attacker_id,
                cause_of_death: payload.cause_of_death,
                game_mode: payload.game_mode,
                host: payload.host,
                map: payload.map,
                servername: payload.servername
            }
            allData.push(killEntry)
        }

        if (!deathEntry) {
            deathEntry = {
                kills: 0,
                deaths: 0,
                max_distance: 0,
                total_distance: 0,
                attacker_name: payload.victim_name,
                attacker_id: payload.victim_id,
                cause_of_death: payload.victim_current_weapon,
                game_mode: payload.game_mode,
                host: payload.host,
                map: payload.map,
                servername: payload.servername
            }
            allData.push(deathEntry)
        }

        killEntry.kills++
        killEntry.total_distance += payload.distance
        killEntry.max_distance = Math.max(killEntry.max_distance || 0, payload.distance)
        deathEntry.deaths++
    })
    return pgClient
}
