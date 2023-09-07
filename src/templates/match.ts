/* eslint-disable @typescript-eslint/naming-convention */
import { Router, type Response } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../common'
import { type MatchData, type MatchCloseData, validateBody, type RequestBody } from '../types'
import db from '../db'
import typia from 'typia'
import { checkOrCreateTitan, checkOrCreateWeapon } from '../utils'
import { type TitanStatsInMatchTable, type WeaponStatsInMatchTable } from '../db/model'

const router = Router()

router.post(
  '/',
  validateBody(typia.createValidate<MatchData>()),
  (req: RequestBody<MatchData>, res: Response) => {
    void (async () => {
      const host_id = res.locals.host_id
      const { air_accel, server_name, game_map, gamemode } = req.body
      const server = await db
        .selectFrom('ToneAPI_v3.server')
        .selectAll()
        .where('ToneAPI_v3.server.host_id', '=', host_id)
        .where('ToneAPI_v3.server.server_name', '=', server_name)
        .executeTakeFirst()
      if (!server) {
        await db
          .insertInto('ToneAPI_v3.server')
          .values({ host_id, server_name })
          .execute()
      }

      await db
        .updateTable('ToneAPI_v3.match')
        .set({ ongoing: false })
        .where('ToneAPI_v3.match.server_name', '=', server_name)
        .execute()

      const match = await db
        .insertInto('ToneAPI_v3.match')
        .values({
          air_accel,
          server_name,
          game_map,
          gamemode,
          host_id,
          ongoing: true
        })
        .returning('ToneAPI_v3.match.match_id')
        .executeTakeFirstOrThrow()

      res.status(201).send({ match: match?.match_id })
    })()
  }
)

router.post(
  '/:match_id/close',
  param('match_id').exists().withMessage('Missing Match ID').bail().isNumeric().withMessage('Match ID is not numeric'),
  validateErrors,
  validateBody(typia.createValidate<MatchCloseData>()),
  (req: RequestBody<MatchCloseData>, res: Response) => {
    void (async () => {
      const host_id = res.locals.host_id
      const match_id = req.params.match_id
      const match = await db
        .selectFrom('ToneAPI_v3.match')
        .selectAll()
        .where('ToneAPI_v3.match.host_id', '=', host_id)
        .where('ToneAPI_v3.match.match_id', '=', match_id)
        .executeTakeFirst()
      if (!match) {
        res.status(403).send({
          errors: [
            {
              msg: 'Match does not exists for this host',
              param: 'match_id',
              location: 'param'
            }
          ]
        })
        return
      }
      const playerPromises: Array<Promise<any>> = []
      for (const playerId in req.body) {
        const NumPlayerId = Number(playerId)
        if (isNaN(NumPlayerId)) {
          res
            .status(400)
            .send({ errors: [{ msg: 'playerId is NaN', location: 'body' }] })
          return
        }
        const playerData = req.body[playerId]

        const promises: Array<Promise<any>> = []
        const weaponStats: WeaponStatsInMatchTable[] = []
        const titanStats: TitanStatsInMatchTable[] = []
        for (const weaponId in playerData.weapons) {
          promises.push(
            checkOrCreateWeapon(weaponId)
              .then(async () => {
                weaponStats.push({
                  match_id: match.match_id,
                  weapon_id: weaponId,
                  player_id: NumPlayerId,
                  headshots: playerData.weapons[weaponId].shotsHeadshot,
                  playtime: playerData.weapons[weaponId].playtime,
                  ricochets: playerData.weapons[weaponId].shotsRichochet,
                  shots_fired: playerData.weapons[weaponId].shotsFired,
                  shots_hit: playerData.weapons[weaponId].shotsHit
                })
              })
          )
        }
        for (const titanId in playerData.titans) {
          promises.push(
            checkOrCreateTitan(titanId).then(async () => {
              titanStats.push({
                match_id: match.match_id,
                titan_id: titanId,
                player_id: NumPlayerId,
                headshots: playerData.titans[titanId].shotsHeadshot,
                playtime: playerData.titans[titanId].playtime,
                ricochets: playerData.titans[titanId].shotsRichochet,
                shots_fired: playerData.titans[titanId].shotsFired,
                shots_hit: playerData.titans[titanId].shotsHit
              })
            })
          )
        }

        playerPromises.push(Promise.all(promises).then(async e => {
          if (weaponStats.length > 0) {
            await db.insertInto('ToneAPI_v3.weapon_stats_in_match')
              .values(weaponStats)
              .execute()
          }
        }))

        playerPromises.push(Promise.all(promises).then(async e => {
          if (titanStats.length > 0) {
            await db.insertInto('ToneAPI_v3.titan_stats_in_match')
              .values(titanStats)
              .execute()
          }
        }))

        playerPromises.push(db.insertInto('ToneAPI_v3.player_stats_in_match')
          .values({
            distance_air: playerData.stats.distance.air,
            distance_ground: playerData.stats.distance.ground,
            distance_wall: playerData.stats.distance.wall,
            time_air: playerData.stats.time.air,
            time_ground: playerData.stats.time.ground,
            time_wall: playerData.stats.time.wall,
            match_id,
            player_id: NumPlayerId
          })
          .execute())
      }
      await Promise.all(playerPromises)
      await db.updateTable('ToneAPI_v3.match')
        .set({ ongoing: false })
        .where('match_id', '=', match_id)
        .execute()
      res.sendStatus(201)
    })()
  }
)

export default router
