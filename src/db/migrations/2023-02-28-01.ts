import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("entity")
    .addColumn("id", "integer", (col) => col.unique().primaryKey())
    .addColumn("name", "varchar")
    .execute();

  await db.schema
    .createTable("weapon")
    .addColumn("id", "varchar", (col) => col.unique().primaryKey())
    .addColumn("name", "varchar")
    .addColumn("description", "varchar")
    .addColumn("image", "varchar")
    .execute();

  await db.schema
    .createTable("map")
    .addColumn("id", "varchar", (col) => col.unique().primaryKey())
    .addColumn("name", "varchar")
    .addColumn("description", "varchar")
    .addColumn("image", "varchar")
    .execute();

  await db.schema
    .createTable("server")
    .addColumn("name", "varchar", (col) => col.unique().primaryKey())
    .addColumn("description", "varchar")
    .addColumn("token", "varchar")
    .execute();

  await db.schema
    .createTable("kill")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("server", "varchar", (col) =>
      col.references("server.name").notNull()
    )
    .addColumn("attacker", "integer", (col) =>
      col.references("entity.id").notNull()
    )
    .addColumn("victim", "integer", (col) =>
      col.references("entity.id").notNull()
    )
    .addColumn("weapon", "varchar", (col) =>
      col.references("weapon.id").notNull()
    )
    .addColumn("map", "varchar", (col) => col.references("map.id").notNull())
    .addColumn("distance", "integer", (col) => col.notNull())
    .addColumn("date", "varchar", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  /*await db.schema
    .createTable("pet")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull().unique())
    .addColumn("owner_id", "integer", (col) =>
      col.references("person.id").onDelete("cascade").notNull()
    )
    .addColumn("species", "varchar", (col) => col.notNull())
    .execute();*/
  /*
  await db.schema
    .createIndex("kill")
    .on("pet")
    .column("owner_id")
    .execute();*/
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("kill").execute();
  await db.schema.dropTable("entity").execute();
  await db.schema.dropTable("weapon").execute();
  await db.schema.dropTable("map").execute();
  await db.schema.dropTable("server").execute();
}
