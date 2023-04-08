import { promises as fs } from "fs";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import * as path from "path";
import { Pool } from "pg";
import Database from "./model";

async function migrateToLatest() {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "./migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

export default migrateToLatest;
