import { Router } from 'express'
import { param, query } from 'express-validator'
import { validateErrors } from '../common'
import db from '../db/db'
import client from '../cache/redis'
const router = Router()
//timeout middleware ?
router.get('/*', (req, res, next) => {
  next()
})

router.get(
  '/weapons/:weaponId',
  param(['weaponId']).exists().isString(),
  query(['player', 'server']).optional().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    let path = ''
    if (req.query.server) path = path + `servers.${req.query.server}.`
    if (req.query.player) path = path + `players.${req.query.player}.`
    path = path + `weapons.${req.params.weaponId}`
    if (await client.json.type('kills', path)) return res.status(200).send(await client.json.get('kills', { path }))
    res.status(404).send()
  }
)

router.get(
  '/weapons/',
  query(['player', 'server']).optional().toInt().isInt(),
  validateErrors,
  async (req, res) => {
    let path = ''
    if (req.query.server) path = path + `servers.${req.query.server}.`
    if (req.query.player) path = path + `players.${req.query.player}.`
    path = path + `weapons`
    if (await client.json.type('kills', path)) {
      const data = await client.json.get('kills', { path: `weapons` }) as { [key: number]: any }
      return res.status(200).send(Object.fromEntries(Object.entries(data).map(([key, value]) => { return [key, { total_distance: value.total_distance, max_distance: value.max_distance, kills: value.kills, deaths: value.deaths }] })))
    }
    res.status(404).send()
  }
)

router.get(
  '/players/:playerId',
  param(['playerId']).exists().toInt().isInt(),
  query(['server']).optional().toInt().isInt(),
  query('weapon').optional().isString(),
  validateErrors,
  async (req, res) => {
    let path = ''
    if (req.query.server) path = path + `servers.${req.query.server}.`
    if (req.query.weapon) path = path + `weapons.${req.query.weapon}.`
    path = path + `players.${req.params.playerId}`
    if (await client.json.type('kills', path)) return res.status(200).send(await client.json.get('kills', { path }))
    res.status(404).send()
  }
)

router.get(
  '/players/',
  query(['server']).optional().toInt().isInt(),
  query('weapon').optional().isString(),
  validateErrors,
  async (req, res) => {
    let path = ''
    if (req.query.server) path = path + `servers.${req.query.server}.`
    if (req.query.weapon) path = path + `weapons.${req.query.weapon}.`
    path = path + `players`
    if (await client.json.type('kills', path)) {
      const data = await client.json.get('kills', { path: `players` }) as { [key: number]: any }
      return res.status(200).send(Object.fromEntries(Object.entries(data).map(([key, value]) => { return [key, { total_distance: value.total_distance, max_distance: value.max_distance, kills: value.kills, deaths: value.deaths }] })))
    }
    res.status(404).send()
  }
)

//router.get('/maps/', (req, res, next) => {})

router.get('/servers/', async (req, res) => {
  const data = await client.json.get('kills', { path: `servers` }) as { [key: number]: any }
  return res.status(200).send(Object.fromEntries(Object.entries(data).map(([key, value]) => { return [key, value.data] })))
})
//router.get('/servers/:serverId/', (req, res, next) => {})

export default router
