import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('player')
    .addColumn('id', 'integer', (col) => col.unique().primaryKey())
    .addColumn('name', 'varchar')
    .addColumn('optout', 'boolean')
    .addColumn('hide_TOS', 'boolean')
    .execute()

  await db.schema
    .createTable('weapon')
    .addColumn('id', 'varchar', (col) => col.unique().primaryKey())
    .addColumn('name', 'varchar')
    .addColumn('description', 'varchar')
    .addColumn('image', 'varchar')
    .execute()

  await db.schema
    .createTable('map')
    .addColumn('id', 'varchar', (col) => col.unique().primaryKey())
    .addColumn('name', 'varchar')
    .addColumn('description', 'varchar')
    .addColumn('image', 'varchar')
    .execute()

  await db.schema
    .createTable('server')
    .addColumn('id', 'integer')
    .addColumn('name', 'varchar', (col) => col.unique().primaryKey())
    .addColumn('description', 'varchar')
    .addColumn('token', 'varchar')
    .execute()

  await db.schema
    .createTable('kill')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('server', 'integer', (col) =>
      col.references('server.id').notNull().onDelete('cascade')
    )
    .addColumn('damage_source', 'varchar')
    .addColumn('attacker', 'integer')
    .addColumn('attacker_type', 'varchar')
    .addColumn('attacker_weapon', 'varchar')
    .addColumn('attacker_weapon_2', 'varchar')
    .addColumn('attacker_weapon_3', 'varchar')
    .addColumn('attacker_ordnance', 'varchar')
    .addColumn('attacker_ability', 'varchar')
    .addColumn('attacker_kit_1', 'varchar')
    .addColumn('attacker_kit_2', 'varchar')
    .addColumn('victim', 'integer')
    .addColumn('victim_weapon', 'varchar')
    .addColumn('victim_weapon_2', 'integer')
    .addColumn('victim_weapon_3', 'integer')
    .addColumn('victim_ordnance', 'integer')
    .addColumn('victim_ability', 'integer')
    .addColumn('victim_kit_1', 'integer')
    .addColumn('victim_kit_2', 'integer')
    .addColumn('map', 'varchar')
    .addColumn('distance', 'integer')
    .addColumn('date', 'varchar', (col) => col.defaultTo(sql`now()`).notNull())
    .execute()

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
  await db.schema.dropTable('kill').execute()
  await db.schema.dropTable('entity').execute()
  await db.schema.dropTable('weapon').execute()
  await db.schema.dropTable('map').execute()
  await db.schema.dropTable('server').execute()
}
