import { Kysely, sql } from 'kysely'
import { Client } from 'pg'

const notify_newkill = `
CREATE OR REPLACE FUNCTION notify_new_kill()
  RETURNS trigger
AS 
$$
BEGIN
  PERFORM pg_notify('new_kill', row_to_json(NEW)::text);
  RETURN NULL;
END;
$$
LANGUAGE plpgsql;
`

const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

export async function up(db: Kysely<any>): Promise<void> {
  await pgClient.connect()
  await pgClient.query(notify_newkill)
  await pgClient.query(`CREATE TRIGGER insert_kills_notify AFTER INSERT ON kill FOR EACH ROW EXECUTE PROCEDURE notify_new_kill();`)
}

export async function down(db: Kysely<any>): Promise<void> {
  await pgClient.query(`DROP FUNCTION IF EXISTS notify_new_kill;`)
  await pgClient.query(`DROP TRIGGER IF EXISTS insert_kills_notify;`)
  await pgClient.end()
}
