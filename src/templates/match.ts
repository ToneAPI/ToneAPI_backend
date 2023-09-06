import { Router, Response } from "express";
import { param } from "express-validator";
import { validateErrors } from "../common";
import { MatchData, validateBody, RequestBody } from "../types";
import db from "../db";
import typia from "typia";

const router = Router();

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


  router.post(
    "/match/:matchId(\d+)/close",
    param('matchId').exists().withMessage("Missing Match ID").bail().isNumeric().withMessage("Match ID is not numeric"),
    validateErrors,
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