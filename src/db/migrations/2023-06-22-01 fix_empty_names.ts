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
  await pgClient.end()
}

export async function down (db: Kysely<any>): Promise<void> {

}
