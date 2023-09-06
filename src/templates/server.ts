/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from "express";
import { header } from "express-validator";

import { /* createKillRecord, */ checkServerToken } from "../db";
import { validateErrors } from "../common";

import match from './match'
import kill from './kill'

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


router.use("/kill", kill)
router.use("/match", match)
export default router;
