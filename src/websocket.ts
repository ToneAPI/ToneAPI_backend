import * as dotenv from 'dotenv'
dotenv.config()
import { Client } from 'pg'
import { WebSocketServer } from 'ws'
import { KillTable } from './db/model'

const port = 3002
const wss = new WebSocketServer({ port })

export const pgClient = new Client({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
})

wss.on('connection', function connection(ws: WebSocket, req) {
    const ip =
        req?.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket.remoteAddress
    console.log(
        new Date().toLocaleString() + ',' + ip + ',connect,' + wss.clients.size
    )
    ws.onclose = function () {
        const ip =
            req?.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
            req.socket.remoteAddress
        console.log(
            new Date().toLocaleString() + ',' + ip + ',close,' + wss.clients.size
        )
    }
})

export default new Promise(async (resolve, reject) => {
    await pgClient.connect()
    await pgClient.query('LISTEN new_kill')

    pgClient.on('notification', (data) => {
        if (!data.payload) return
        const payload = JSON.parse(data.payload) as KillTable
        wss.clients.forEach(function (client) {
            if (client.readyState === client.OPEN) {
                client.send(
                    JSON.stringify({
                        attacker_id: payload.attacker_id,
                        attacker_name: payload.attacker_name,
                        cause_of_death: payload.cause_of_death,
                        victim_id: payload.victim_id,
                        victim_name: payload.victim_name,
                        attacker_current_weapon: payload.attacker_current_weapon,
                        victim_current_weapon: payload.victim_current_weapon,
                        distance: payload.distance,
                        game_mode: payload.game_mode,
                        servername: payload.servername,
                        map: payload.map,
                        host: payload.host
                    })
                )
            }
        })
    })
})
