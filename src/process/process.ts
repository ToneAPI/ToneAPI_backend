import db from '../db/db'
const { count, max, sum, coalesce } = db.fn
import { sql } from 'kysely'

export let allData: Awaited<ReturnType<typeof processGlobalStats>>

/**
 * populates allData
 * @returns
 */
async function processAll() {
  console.log('Starting data calculation...')
  const timeStart = new Date()

  allData = await processGlobalStats()

  console.log(
    'Data calculation finished. Took + ' +
    Math.abs(new Date().getTime() - timeStart.getTime()) / 1000 +
    ' seconds'
  )
  if (process.env.ENVIRONMENT == 'production') {
    return
  }
}

async function processGlobalStats() {
  return await db
    .with('kills', (db) =>
      db
        .selectFrom('kill')
        .select([
          count<number>('id').as('kills'),
          coalesce(
            max<number | null, 'distance'>('distance'),
            sql<number>`0`
          ).as('max_distance'),
          coalesce(sum<number | null>('distance'), sql<number>`0`).as(
            'total_distance'
          ),
          'attacker_id',
          sql<string>`last(attacker_name)`.as('attacker_name'),
          'cause_of_death',
          'map',
          'game_mode',
          'servername',
          'host'
        ])
        .whereRef('attacker_id', '!=', 'victim_id')
        .groupBy([
          'attacker_id',
          'cause_of_death',
          'map',
          'servername',
          'host',
          'game_mode'
        ])
    )
    .with('deaths', (db) =>
      db
        .selectFrom('kill')
        .select([
          count<number>('id').as('deaths'),
          'victim_id',
          'victim_current_weapon',
          'map',
          'game_mode',
          'servername',
          'host'
        ])
        .groupBy([
          'victim_id',
          'victim_current_weapon',
          'map',
          'servername',
          'host',
          'game_mode'
        ])
    )
    .selectFrom('kills')
    .leftJoin('deaths', (join) =>
      join
        .onRef('deaths.victim_id', '=', 'kills.attacker_id')
        .onRef('deaths.victim_current_weapon', '=', 'kills.cause_of_death')
        .onRef('deaths.servername', '=', 'kills.servername')
        .onRef('deaths.host', '=', 'kills.host')
        .onRef('deaths.game_mode', '=', 'kills.game_mode')
        .onRef('deaths.map', '=', 'kills.map')
    )
    .selectAll('kills')
    .select(sql<number>`COALESCE(deaths.deaths, 0)`.as('deaths'))
    .execute()
}
export default processAll
