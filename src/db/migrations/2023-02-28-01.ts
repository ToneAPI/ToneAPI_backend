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
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.unique())
    .addColumn('description', 'varchar')
    .addColumn('token', 'varchar', (col) =>
      col
        .notNull()
        .unique()
        .defaultTo(sql`gen_random_uuid()`)
    )
    .execute()

  await db.schema
    .createTable('kill')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('server', 'integer', (col) =>
      col.references('server.id').notNull().onDelete('cascade')
    )
    .addColumn('killstat_version', 'varchar')
    .addColumn('match_id', 'varchar')
    .addColumn('game_mode', 'varchar')
    .addColumn('map', 'varchar')
    .addColumn('unix_time', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('game_time', 'decimal')
    .addColumn('player_count', 'integer')
    .addColumn('attacker_name', 'varchar')
    .addColumn('attacker_id', 'varchar')
    .addColumn('attacker_current_weapon', 'varchar')
    .addColumn('attacker_current_weapon_mods', 'integer')
    .addColumn('attacker_weapon_1', 'varchar')
    .addColumn('attacker_weapon_1_mods', 'integer')
    .addColumn('attacker_weapon_2', 'varchar')
    .addColumn('attacker_weapon_2_mods', 'integer')
    .addColumn('attacker_weapon_3', 'varchar')
    .addColumn('attacker_weapon_3_mods', 'integer')
    .addColumn('attacker_offhand_weapon_1', 'integer')
    .addColumn('attacker_offhand_weapon_2', 'integer')
    .addColumn('victim_name', 'varchar')
    .addColumn('victim_id', 'varchar')
    .addColumn('victim_current_weapon', 'varchar')
    .addColumn('victim_current_weapon_mods', 'integer')
    .addColumn('victim_weapon_1', 'varchar')
    .addColumn('victim_weapon_1_mods', 'integer')
    .addColumn('victim_weapon_2', 'varchar')
    .addColumn('victim_weapon_2_mods', 'integer')
    .addColumn('victim_weapon_3', 'varchar')
    .addColumn('victim_weapon_3_mods', 'integer')
    .addColumn('victim_offhand_weapon_1', 'integer')
    .addColumn('victim_offhand_weapon_2', 'integer')
    .addColumn('cause_of_death', 'varchar')
    .addColumn('distance', 'decimal')
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
  await db.schema.dropTable('player').execute()
  await db.schema.dropTable('weapon').execute()
  await db.schema.dropTable('map').execute()
  await db.schema.dropTable('server').execute()
}
