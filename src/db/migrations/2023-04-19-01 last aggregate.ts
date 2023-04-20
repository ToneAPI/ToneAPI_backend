import { Kysely, sql } from 'kysely'
import { Client } from 'pg'

const pgClient = new Client({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
})

export async function up(db: Kysely<any>): Promise<void> {
    await pgClient.connect()
    await pgClient.query(`CREATE OR REPLACE FUNCTION public.first_agg (anyelement, anyelement)
  RETURNS anyelement
  LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS
'SELECT $1';`)

    await pgClient.query(`CREATE AGGREGATE public.first (anyelement) (
    SFUNC    = public.first_agg
  , STYPE    = anyelement
  , PARALLEL = safe
  );`)

    await pgClient.query(`CREATE OR REPLACE FUNCTION public.last_agg (anyelement, anyelement)
  RETURNS anyelement
  LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS
'SELECT $2';`)


    await pgClient.query(`CREATE AGGREGATE public.last (anyelement) (
    SFUNC    = public.last_agg
  , STYPE    = anyelement
  , PARALLEL = safe
  );`)
    //Update the hosts column once the hoster table is manually updated
    await pgClient.end()
}

export async function down(db: Kysely<any>): Promise<void> {
    await pgClient.connect()
    pgClient.query('DROP AGGREGATE public.last')
    pgClient.query('DROP FUNCTION public.last_agg')
    pgClient.query('DROP AGGREGATE public.first')
    pgClient.query('DROP AGGREGATE public.first_agg')
    await pgClient.end()
}
