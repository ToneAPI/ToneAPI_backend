import { RequestHandler, Request } from "express";
import typia from "typia";

type WeaponKillData = {
  id: string;
  mods: number;
};

export type LoadoutKillData = {
  ordnance: WeaponKillData | null;
  secondary: WeaponKillData | null;
  primary: WeaponKillData | null;
  tactical: WeaponKillData | null;
  anti_titan: WeaponKillData | null;
  passive1:string | null;
  passive2:string | null;
  titan: string | null;
};

type PlayerKillData = {
  velocity: number;
  name: string;
  loadout: LoadoutKillData;
  current_weapon: WeaponKillData;
  state: string;
  id: string;
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

export const validateBody =
  <T>(checker: (input: T) => typia.IValidation<T>): RequestHandler =>
  (req, res, next) => {
    const result: typia.IValidation<T> = checker(req.body);
    if (!result.success) {
      res.status(400).send({ errors: result.errors });
      console.error(result.errors)
    } else {
      next();
    }
  };
