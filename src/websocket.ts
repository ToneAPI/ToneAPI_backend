import * as dotenv from 'dotenv'
import { Client } from 'pg'
import { type WebSocket, WebSocketServer } from 'ws'
import { type KillTable } from './db/model'
dotenv.config()

const port = 3002
const wss = new WebSocketServer({ port })

export const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

wss.on('connection', function connection (ws: WebSocket & { isAlive: boolean }, req) {
  const ip = req?.headers['x-forwarded-for']?.toString().split(',')[0].trim() ??
        req.socket.remoteAddress ?? 'ip_unknown'
  console.log(`${new Date().toLocaleString()},${ip},connect,${wss.clients.size}`)
  ws.onclose = function () {
    console.log(`${new Date().toLocaleString()},${ip},connect,${wss.clients.size}`)
  }
  ws.onmessage = function (msg) {
    if (msg.data === 'pong') {
      ws.isAlive = true
      return
    }
    if (msg.data === 'ping') {
      ws.send('pong')
    }
  }
  ws.send('ping')
})

const interval = setInterval(function ping () {
  wss.clients.forEach(function each (ws) {
    if (!(ws as WebSocket & { isAlive: boolean }).isAlive) { ws.terminate(); return }

    (ws as WebSocket & { isAlive: boolean }).isAlive = false
    ws.send('ping')
  })
}, 30000)

wss.on('close', function close () {
  clearInterval(interval)
})

export default async () => {
  await pgClient.connect()
  await pgClient.query('LISTEN new_kill')

  pgClient.on('notification', (data) => {
    if (!data.payload) return
    const payload = JSON.parse(data.payload) as KillTable
    wss.clients.forEach(function (client) {
      if (client.readyState === client.OPEN) {
        client.send(
          JSON.stringify({
            match_id: payload.match_id,
            attacker_id: payload.attacker_id
            // attacker_name: payload.attacker_name,
            // cause_of_death: payload.cause_of_death,
            // victim_id: payload.victim_id,
            // victim_name: payload.victim_name,
            // attacker_current_weapon: payload.attacker_current_weapon,
            // victim_current_weapon: payload.victim_current_weapon,
            // distance: payload.distance,
            // game_mode: payload.game_mode,
            // servername: payload.servername,
            // map: payload.map,
            // host: payload.host
          })
        )
      }
    })
  })
}
