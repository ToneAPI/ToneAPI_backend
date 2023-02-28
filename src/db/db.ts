import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import migrateToLatest from "./migrations";
import Database from "./model";
migrateToLatest();
// You'd create one of these when you start your app.
const db = new Kysely<Database>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    }),
  }),
});
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
export default "e";
