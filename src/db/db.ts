import * as dotenv from 'dotenv'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import migrateToLatest from './migrations'
import { type KillTable } from './model'
import type Database from './model'
dotenv.config()
const migration = migrateToLatest()
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      max: 30
    })
  }),
  log (event) {
    if (process.env.ENVIRONMENT !== 'dev') {
      return
    }
    if (event.level === 'query') {
      console.log(event.query.sql)
      console.log(event.query.parameters)
    }
  }
})

interface RemoveFromKill {
  id: unknown
  unix_time: unknown
}

type KillRecord = Omit<KillTable, keyof RemoveFromKill>

export async function CreateKillRecord (data: KillRecord) {
  await db
    .insertInto('kill')
    .values({ ...data })
    .execute()
}
export async function getHostList () {
  return await db.selectFrom('host').select(['id', 'host.name']).execute()
}
// tokens are stored in raw... maybe we should use something better in the future
// Using callback for express-basic-auth
export async function CheckServerToken (token: string) {
  return await db.selectFrom('host').select('id')
    .where('token', '=', Buffer.from(token, 'base64').toString())
    .executeTakeFirst()
    .then((result) => {
      return result
    })
}

export async function dbReady (): Promise<Kysely<Database>> {
  await migration
  return db
}

export default db
