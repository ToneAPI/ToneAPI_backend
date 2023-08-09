/* eslint-disable @typescript-eslint/naming-convention */
import { Router, Request, Response } from "express";
import { header } from "express-validator";
import db, { /* CreateKillRecord, */ CheckServerToken } from "../db/db";
import { validateErrors } from "../common";
import { KillData, MatchData, validateBody } from "../server/types";
import typia from "typia";

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
      const query = await CheckServerToken(
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
      const { match_id } = req.body;
      const match = await db
        .selectFrom("ToneAPI_v3.match")
        .select(["ToneAPI_v3.match.host_id", "ToneAPI_v3.match.match_id"])
        .where("ToneAPI_v3.match.host_id", "=", host_id)
        .where("ToneAPI_v3.match.match_id", "=", match_id)
        .executeTakeFirst();
      if (!match) {
        res
          .status(403)
          .send({
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
      req.body;
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
      const match = await db
        .insertInto("ToneAPI_v3.match")
        .values({ air_accel, server_name, game_map, gamemode, host_id })
        .executeTakeFirst();
      res.status(201).send({ match: match.insertId });
    })();
  }
);

export default router;
