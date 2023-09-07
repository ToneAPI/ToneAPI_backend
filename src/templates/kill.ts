/* eslint-disable @typescript-eslint/naming-convention */
import { Router, type Response } from 'express'
import {
  checkOrCreateLoadout,
  checkOrCreateTitan,
  checkOrCreateWeapon
} from '../utils'
import { type KillData, validateBody, type RequestBody } from '../types'
import db from '../db'
import typia from 'typia'

const router = Router()

router.post(
  '/',
  validateBody(typia.createValidate<KillData>()),
  (req: RequestBody<KillData>, res: Response) => {
    void (async () => {
      const host_id = res.locals.host_id
      const startTime = Date.now()
      const {
        game_time,
        distance,
        match_id,
        attacker: attackerData,
        victim: victimData,
        cause_of_death
      } = req.body
      const attacker_id = Number(attackerData.id)
      const victim_id = Number(victimData.id)
      if (isNaN(attacker_id) || isNaN(victim_id)) {
        res
          .status(400)
          .send({ errors: [{ msg: 'attacker_id or victim_id is NaN' }] })
        return
      }
      const match = await db
        .selectFrom('ToneAPI_v3.match')
        .select(['ToneAPI_v3.match.ongoing', 'ToneAPI_v3.match.match_id'])
        .where('ToneAPI_v3.match.host_id', '=', host_id)
        .where('ToneAPI_v3.match.match_id', '=', match_id)
        .executeTakeFirst()
      if (!match) {
        res.status(403).send({
          errors: [
            {
              msg: 'Match does not exists',
              param: 'match_id',
              location: 'body'
            }
          ]
        })
        return
      }

      if (!match.ongoing) {
        res.status(409).send({
          errors: [
            {
              msg: 'Match is already closed',
              param: 'match_id',
              location: 'body'
            }
          ]
        })
        return
      }
      // await checkUpdateOrCreatePlayer(
      //   { id: attacker_id, name: attackerData.name })
      // await checkUpdateOrCreatePlayer(
      //   { id: victim_id, name: victimData.name }
      // )

      await Promise.all([
        checkOrCreateWeapon(cause_of_death),
        checkOrCreateWeapon(attackerData.current_weapon.id),
        checkOrCreateWeapon(victimData.current_weapon.id),
        async () => { if (attackerData.loadout.titan) { await checkOrCreateTitan(attackerData.loadout.titan) } },
        async () => { if (victimData.loadout.titan) { await checkOrCreateTitan(victimData.loadout.titan) } }
      ])

      const [attacker_loadout, victim_loadout] = await Promise.all([
        checkOrCreateLoadout(attackerData.loadout),
        checkOrCreateLoadout(victimData.loadout)
      ])

      const insertResult = await db
        .insertInto('ToneAPI_v3.kill')
        .values({
          attacker_id,
          victim_id,
          match_id,
          attacker_loadout_id: attacker_loadout,
          victim_loadout_id: victim_loadout,
          attacker_speed: attackerData.velocity,
          victim_speed: victimData.velocity,
          attacker_movementstate: attackerData.state,
          victim_movementstate: victimData.state,
          distance,
          game_time,
          cause_of_death,
          attacker_held_weapon: attackerData.current_weapon.id,
          victim_held_weapon: victimData.current_weapon.id
        })
        .returning('kill_id')
        .executeTakeFirstOrThrow()

      res.status(201).send({ id: insertResult.kill_id })
      console.log((Date.now() - startTime) + ' ms')
    })()
  }
)

export default router
