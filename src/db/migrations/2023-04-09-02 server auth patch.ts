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
  await pgClient.query('ALTER TABLE kill ADD servername character varying NULL;')
  await pgClient.query('ALTER TABLE kill ADD host integer NULL;')
  await pgClient.query('UPDATE kill SET servername = server.name FROM server WHERE server.id = kill.server;')
  await pgClient.query('ALTER TABLE kill ALTER COLUMN servername SET NOT NULL;')
  await pgClient.query('ALTER TABLE kill DROP COLUMN server;')

  //await pgClient.query('ALTER TABLE server RENAME TO hoster')
  //await pgClient.query('ALTER TABLE hoster DROP COLUMN description')
  //await pgClient.query('ALTER TABLE kill ADD COLUMN host integer NULL')
  await pgClient.query('CREATE TABLE host (name character varying, token character varying)')

  //Update the hosts column once the hoster table is manually updated
  await pgClient.end()
}

export async function down(db: Kysely<any>): Promise<void> {
  await pgClient.connect()
  //await pgClient.query('ALTER TABLE kill DROP COLUMN host')
  //await pgClient.query('ALTER TABLE hoster add description character varying NULL')
  //await pgClient.query('ALTER TABLE hoster RENAME TO server')
  await pgClient.query('DROP TABLE host')

  await pgClient.query(`ALTER TABLE kill ADD server integer NULL;`)
  await pgClient.query('UPDATE kill SET server = server.id FROM server where server.name = kill.servername;')
  await pgClient.query('ALTER TABLE kill ALTER COLUMN server SET NOT NULL;')
  await pgClient.query('ALTER TABLE kill DROP COLUMN servername;')
  await pgClient.end()
}
