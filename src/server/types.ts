import { RequestHandler, Request } from "express";
import typia from "typia";

type WeaponKillData = {
  name: string;
  mods: number;
};

type PlayerKillData = {
  velocity: number;
  name: string;
  loadout: {
    ordnance: WeaponKillData;
    secondary: WeaponKillData;
    primary: WeaponKillData;
    tactical: WeaponKillData;
    anti_titan: WeaponKillData;
  };
  current_weapon: WeaponKillData;
  state: string;
  titan: string | null;
  id: number | bigint;
  cloaked: boolean;
};

export type MatchData = {
  server_name: string;
  game_map: string;
  gamemode: string;
  air_accel: boolean;
};

export type KillData = {
  game_time: number;
  player_count: number;
  match_id: number;
  victim: PlayerKillData;
  attacker: PlayerKillData;
  distance: number;
  cause_of_death: string;
};

type RequestBody<T> = Request<{}, {}, T>;

export const validateBody =
  <T>(checker: (input: T) => typia.IValidation<T>): RequestHandler =>
  (req, res, next) => {
    const result: typia.IValidation<T> = checker(req.body);
    if (!result.success) {
      res.status(400).send({ errors: result.errors });
    } else {
      next();
    }
  };
