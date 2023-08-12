/* eslint-disable @typescript-eslint/naming-convention */
import { Router, Request, Response } from "express";
import { header, param } from "express-validator";
import {
  checkOrCreateLoadout,
  checkOrCreateWeapon,
  checkUpdateOrCreatePlayer,
} from "../utils";
import db, { /* createKillRecord, */ checkServerToken } from "../db";
import { validateErrors } from "../common";
import { KillData, MatchData, validateBody } from "../types";
import typia, { validate } from "typia";

const router = Router();

// auth middleware
router.post(
  "/*",
  header("authorization")
    .exists({ checkFalsy: true })
    .withMessage("Missing Authorization Header")
    .bail()
    .custom((e) => e.split(" ")[0].toLowerCase() === "bearer")
    .withMessage("Authorization Token is not Bearer"),
  validateErrors,
  (req, res, next) => {
    void (async () => {
      if (!req.headers.authorization) {
        return res.sendStatus(401);
      }
      const query = await checkServerToken(
        req.headers.authorization.split(" ")[1]
      );
      if (!query?.host_id) {
        console.error(
          `incorrect token : ${
            req.headers.authorization.split(" ")[1]
          } with IP ${
            req.headers["x-forwarded-for"]?.toString() ??
            req.socket.remoteAddress?.toString() ??
            ""
          }`
        );
        return res.status(401).send({
          errors: [
            {
              msg: "Incorrect Token",
              param: "authorization",
              location: "headers",
            },
          ],
        });
      }
      res.locals.host_id = query.host_id;
      next();
    })();
  }
);

// Route to check auth
router.post("/", (req, res) => {
  res.sendStatus(200);
});

// const serversCount: Record<string, number> = {}
// const serversTimeout: Record<string, NodeJS.Timeout> = {}

// same rate limiting code as register. max 10 kills per server every 1 sec. should be enough.
/* router.post('/kill', (req, res, next) => {
  let host = Number(req.query.serverId)
  if (serversCount[serverId] > 2) {
    return res.status(429).json({
      error: 'too many requests. Are players really making that much kills ?'
    })
  }
  clearTimeout(serversTimeout[serverId])
  serversCount[serverId] =
    serversCount[serverId] ?? (serversCount[serverId] + 1) | 1
  serversTimeout[serverId] = setTimeout(() => {
    serversCount[serverId] = 0
  }, 1000)
  next()
}) */

type RequestBody<T> = Request<{}, {}, T>;

router.post(
  "/kill",
  validateBody(typia.createValidate<KillData>()),
  (req: RequestBody<KillData>, res: Response) => {
    void (async () => {
      const host_id = res.locals.host_id;
      const {
        game_time,
        distance,
        match_id,
        attacker: attackerData,
        victim: victimData,
        cause_of_death,
      } = req.body;
      const match = await db
        .selectFrom("ToneAPI_v3.match")
        .select(["ToneAPI_v3.match.ongoing", "ToneAPI_v3.match.match_id"])
        .where("ToneAPI_v3.match.host_id", "=", host_id)
        .where("ToneAPI_v3.match.match_id", "=", match_id)
        .executeTakeFirst();
      if (!match) {
        res.status(403).send({
          errors: [
            {
              msg: "Match does not exists",
              param: "match_id",
              location: "body",
            },
          ],
        });
        return;
      }

      if(!match.ongoing){
        res.status(409).send({
          errors: [
            {
              msg: "Match is already closed",
              param: "match_id",
              location: "body",
            },
          ],
        });
        return;
      }
      let attacker_loadout: number | undefined;
      let victim_loadout: number | undefined;
      await Promise.all([
        checkUpdateOrCreatePlayer(attackerData),
        checkUpdateOrCreatePlayer(victimData),
        checkOrCreateWeapon(cause_of_death),
        checkOrCreateWeapon(attackerData.current_weapon.id),
        checkOrCreateWeapon(victimData.current_weapon.id),
        checkOrCreateLoadout(attackerData.loadout).then(
          (e) => (attacker_loadout = e)
        ),
        checkOrCreateLoadout(victimData.loadout).then(
          (e) => (victim_loadout = e)
        ),
      ]);
      if (attacker_loadout === undefined) {
        throw new Error("attacker_lodaout is undefined");
      }
      if (victim_loadout === undefined) {
        throw new Error("victim_lodaout is undefined");
      }
      const insertResult = await db
        .insertInto("ToneAPI_v3.kill")
        .values({
          attacker_id: attackerData.id,
          victim_id: victimData.id,
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
          victim_held_weapon: victimData.current_weapon.id,
        })
        .returning("kill_id")
        .executeTakeFirstOrThrow();

      res.status(201).send({ id: insertResult.kill_id });
    })();
  }
);

router.post(
  "/match",
  validateBody(typia.createValidate<MatchData>()),
  (req: RequestBody<MatchData>, res: Response) => {
    void (async () => {
      const host_id = res.locals.host_id;
      const { air_accel, server_name, game_map, gamemode } = req.body;
      const server = await db
        .selectFrom("ToneAPI_v3.server")
        .selectAll()
        .where("ToneAPI_v3.server.host_id", "=", host_id)
        .where("ToneAPI_v3.server.server_name", "=", server_name)
        .executeTakeFirst();
      if (!server) {
        await db
          .insertInto("ToneAPI_v3.server")
          .values({ host_id, server_name })
          .execute();
      }

      await db
        .updateTable("ToneAPI_v3.match")
        .set({ ongoing: false })
        .where("ToneAPI_v3.match.server_name", "=", server_name)
        .execute();

      const match = await db
        .insertInto("ToneAPI_v3.match")
        .values({
          air_accel,
          server_name,
          game_map,
          gamemode,
          host_id,
          ongoing: true,
        })
        .returning("ToneAPI_v3.match.match_id")
        .executeTakeFirstOrThrow();

      res.status(201).send({ match: match?.match_id });
    })();
  }
);

export default router;
