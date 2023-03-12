import { InsertObject, Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import migrateToLatest from './migrations'
import Database, { KillTable } from './model'

const migration = migrateToLatest()
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    })
  }),
  log(event) {
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

export async function CreateKillRecord(data: KillRecord) {
  //TODO : Handle server foreign key crashes
  await db
    .insertInto('kill')
    .values({ ...data })
    .execute()
}

export async function FindServer({ name }: { name: string }) {
  return await db
    .selectFrom('server')
    .select(['server.name', 'server.description'])
    .where('server.name', '=', name)
    .executeTakeFirst()
}

export async function CreateServer({
  name,
  description
}: {
  name: string
  description: string
}) {
  return await db
    .insertInto('server')
    .values({ name, description })
    .returning(['id', 'token'])
    .executeTakeFirstOrThrow()
}

//tokens are stored in raw... maybe we should use something better in the future
//Using callback for express-basic-auth
export function CheckServerToken(
  this: { body: any },
  name: string,
  password: string,
  cb: (error: Error | null, success: boolean) => void
) {
  db.selectFrom('server')
    .where('id', '=', Number(name))
    .where('token', '=', password)
    .executeTakeFirst()
    .then((result) => {
      if (!!result) this.body.serverId = name
      cb(null, !!result)
    })
}
/*
async function demo() {
  const { id } = await db
    .insertInto("person")
    .values({ first_name: "Jennifer", gender: "female" })
    .returning("id")
    .executeTakeFirstOrThrow();

  await db
    .insertInto("pet")
    .values({ name: "Catto", species: "cat", owner_id: id })
    .execute();

  const person = await db
    .selectFrom("person")
    .innerJoin("pet", "pet.owner_id", "person.id")
    .select(["first_name", "pet.name as pet_name"])
    .where("person.id", "=", id)
    .executeTakeFirst();

  if (person) {
    person.pet_name;
  }
}
*/
export async function dbReady(): Promise<Kysely<Database>> {
  await migration
  return db
}

export default db
