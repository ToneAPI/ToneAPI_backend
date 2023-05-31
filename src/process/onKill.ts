import { Client } from 'pg'
import { allData } from './process'

export const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

export default async function listenKills () {
  await pgClient.connect()
  await pgClient.query('LISTEN new_kill')

  pgClient.on('notification', (data) => {
    if (!data.payload) return
    const payload = JSON.parse(data.payload)
    console.log(`recieved kill for ${payload.attacker_name as string}`)
    let killEntry = allData[payload.attacker_id]
    let deathEntry = allData[payload.victim_id]

    if (!killEntry) {
      killEntry = {
        kills: 0,
        deaths: 0,
        max_distance: 0,
        total_distance: 0,
        deaths_while_equipped: 0,
        username: payload.attacker_name
      }
      allData[payload.attacker_id] = killEntry
    }

    if (!deathEntry) {
      deathEntry = {
        kills: 0,
        deaths: 0,
        max_distance: 0,
        total_distance: 0,
        deaths_while_equipped: 0,
        username: payload.attacker_name
      }
      allData[payload.victim_id] = deathEntry
    }

    if (payload.victim_id !== payload.attacker_id) {
      killEntry.kills++
      killEntry.total_distance = Number(killEntry.total_distance) + Number(payload.distance)
      killEntry.max_distance = Math.max(killEntry.max_distance || 0, payload.distance)
    }
    deathEntry.deaths++
    deathEntry.deaths_while_equipped++
    deathEntry.username = payload.victim_name
    killEntry.username = payload.attacker_name
  })
  return pgClient
}
