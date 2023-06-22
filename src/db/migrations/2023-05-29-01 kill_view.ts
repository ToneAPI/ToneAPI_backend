import { type Kysely } from 'kysely'
import { Client } from 'pg'

const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

export async function up (db: Kysely<any>): Promise<void> {
  await pgClient.connect()
  await pgClient.query('DROP TABLE IF EXISTS kill_view;')
  console.log('creating table kill_view')
  await pgClient.query(`CREATE TABLE kill_view
  AS (
    with "kills" as (select count("id") as "kills", coalesce(max("distance"), 0) as "max_distance", coalesce(sum("distance"), 0) as "total_distance", "attacker_id", last(attacker_name) as "attacker_name", "cause_of_death", "map", "game_mode", "servername", "host" from "kill" where "attacker_id" != "victim_id" group by "attacker_id", "cause_of_death", "map", "servername", "host", "game_mode"), "deaths" as (select count("id") as "deaths", "victim_id", last(victim_name) as "victim_name", "cause_of_death", "map", "game_mode", "servername", "host" from "kill" group by "victim_id", "cause_of_death", "map", "servername", "host", "game_mode"), "deathswithweapon" as (select count("id") as "deaths", "victim_id", "victim_current_weapon", "map", "game_mode", "servername", "host" from "kill" group by "victim_id", "victim_current_weapon", "map", "servername", "host", "game_mode") select COALESCE(kills.attacker_name, deaths.victim_name) as "attacker_name", COALESCE(kills.attacker_id, deaths.victim_id) as "attacker_id", COALESCE(kills.kills, 0) as "kills", COALESCE(kills.total_distance, 0) as "total_distance", COALESCE(deathswithweapon.deaths, 0) as "deaths_with_weapon", COALESCE(kills.max_distance, 0) as "max_distance", COALESCE(deaths.deaths, 0) as "deaths", COALESCE(kills.servername, deaths.servername) as "servername", COALESCE(kills.host, deaths.host) as "host", COALESCE(kills.cause_of_death, deaths.cause_of_death) as "cause_of_death", COALESCE(kills.map, deaths.map) as "map", COALESCE(kills.game_mode, deaths.game_mode) as "game_mode" from "kills" full join "deaths" on "deaths"."victim_id" = "kills"."attacker_id" and "deaths"."cause_of_death" = "kills"."cause_of_death" and "deaths"."servername" = "kills"."servername" and "deaths"."host" = "kills"."host" and "deaths"."game_mode" = "kills"."game_mode" and "deaths"."map" = "kills"."map" left join "deathswithweapon" on "deathswithweapon"."victim_id" = "kills"."attacker_id" and "deathswithweapon"."victim_current_weapon" = "kills"."cause_of_death" and "deathswithweapon"."servername" = "kills"."servername" and "deathswithweapon"."host" = "kills"."host" and "deathswithweapon"."game_mode" = "kills"."game_mode" and "deathswithweapon"."map" = "kills"."map"
    );`)
  console.log('creating index on attacker_id')
  await pgClient.query('CREATE INDEX ON kill_view USING HASH ("attacker_id");')
  console.log('creating index on map')
  await pgClient.query('CREATE INDEX ON kill_view USING HASH ("map");')
  console.log('creating index on game_mode')
  await pgClient.query('CREATE INDEX ON kill_view USING HASH ("game_mode");')
  console.log('creating index on cause_of_death')
  await pgClient.query('CREATE INDEX ON kill_view USING HASH ("cause_of_death");')
  console.log('creating index on server')
  await pgClient.query('CREATE INDEX ON kill_view ("servername", "host");')
  console.log('creating function update_kill_view_fnct')
  await pgClient.query(`CREATE OR REPLACE FUNCTION update_kill_view_fnct()
  RETURNS TRIGGER 
AS $$
BEGIN
 IF EXISTS(
       SELECT * FROM kill_view 
       WHERE 
           new.attacker_id = attacker_id AND 
           new.map = map AND 
           new.game_mode = game_mode AND 
           new.cause_of_death = cause_of_death AND 
           new.servername = servername AND 
           new.host = host
   ) THEN
       UPDATE kill_view SET kills = kills + 1, 
       max_distance = (SELECT Max(v) FROM (VALUES (new.distance), (max_distance)) AS value(v)),
       total_distance = total_distance + new.distance,
       attacker_name = new.attacker_name
       WHERE 
           new.attacker_id = attacker_id AND 
           new.map = map AND 
           new.game_mode = game_mode AND 
           new.cause_of_death = cause_of_death AND 
           new.servername = servername AND 
           new.host = host;
   ELSE
       INSERT INTO kill_view(kills,deaths, deaths_with_weapon, attacker_id, map, game_mode, cause_of_death, servername, host, max_distance, total_distance, attacker_name)
       VALUES(1,0,0, new.attacker_id, new.map, new.game_mode, new.cause_of_death, new.servername, new.host,new.distance, new.distance, new.attacker_name);
 END IF;
   
   
 IF EXISTS(
       SELECT * FROM kill_view 
       WHERE 
           new.victim_id = attacker_id AND 
           new.map = map AND 
           new.game_mode = game_mode AND 
           new.cause_of_death = cause_of_death AND 
           new.servername = servername AND 
           new.host = host
   ) THEN
       UPDATE kill_view SET deaths = deaths + 1 
       WHERE 
           new.victim_id = attacker_id AND 
           new.map = map AND 
           new.game_mode = game_mode AND 
           new.cause_of_death = cause_of_death AND 
           new.servername = servername AND 
           new.host = host;
   ELSE
       INSERT INTO kill_view(deaths, kills, deaths_with_weapon, attacker_id, map, game_mode, cause_of_death, servername, host, max_distance, total_distance, attacker_name)
       VALUES(1,0,0, new.victim_id, new.map, new.game_mode, new.cause_of_death, new.servername, new.host,0,0, new.victim_name);
 END IF;
 
 
 IF EXISTS(
       SELECT * FROM kill_view 
       WHERE 
           new.victim_id = attacker_id AND 
           new.map = map AND 
           new.game_mode = game_mode AND 
           new.attacker_current_weapon = cause_of_death AND 
           new.servername = servername AND 
           new.host = host
   ) THEN
       UPDATE kill_view SET deaths_with_weapon = deaths_with_weapon + 1 
       WHERE 
           new.victim_id = attacker_id AND 
           new.map = map AND 
           new.game_mode = game_mode AND 
           new.attacker_current_weapon = cause_of_death AND 
           new.servername = servername AND 
           new.host = host;
   ELSE
       INSERT INTO kill_view(deaths, kills, deaths_with_weapon, attacker_id, map, game_mode, cause_of_death, servername, host, max_distance, total_distance, attacker_name)
       VALUES(0,0,1, new.victim_id, new.map, new.game_mode, new.attacker_current_weapon, new.servername, new.host,0,0, new.victim_name);
 END IF;
   
   
   RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;`)
  console.log('creating trigger update_kill_view')
  await pgClient.query(`CREATE OR REPLACE TRIGGER update_kill_view
AFTER INSERT ON kill
FOR EACH ROW
EXECUTE FUNCTION update_kill_view_fnct();`)
  await pgClient.end()
}

export async function down (db: Kysely<any>): Promise<void> {
  await pgClient.connect()
  await pgClient.query('DROP TRIGGER IF EXISTS update_kill_view;')
  await pgClient.query('DROP FUNCTION IF EXISTS update_kill_view_fnct')
  await pgClient.query('DROP TABLE IF EXISTS kill_view;')
  await pgClient.end()
}
