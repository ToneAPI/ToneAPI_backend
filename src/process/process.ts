import db from '../db/db'
import { sql } from 'kysely'
const { count, max, sum, coalesce } = db.fn

export let allData: Awaited<ReturnType<typeof processGlobalStats>>

/**
 * populates allData
 * @returns
 */
async function processAll (): Promise<void> {
  console.log('Starting data calculation...')
  const timeStart = new Date()

  // allData = await processGlobalStats()

  console.log(`Data calculation finished. Took + ${Math.abs(new Date().getTime() - timeStart.getTime()) / 1000} seconds`)
}

async function processGlobalStats () {
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
          sql<string>`last(victim_name)`.as('victim_name'),
          'cause_of_death',
          'map',
          'game_mode',
          'servername',
          'host'
        ])
        .groupBy([
          'victim_id',
          'cause_of_death',
          'map',
          'servername',
          'host',
          'game_mode'
        ])
    ).with('deathswithweapon', (db) =>
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
    .fullJoin('deaths', (join) =>
      join
        .onRef('deaths.victim_id', '=', 'kills.attacker_id')
        .onRef('deaths.cause_of_death', '=', 'kills.cause_of_death')
        .onRef('deaths.servername', '=', 'kills.servername')
        .onRef('deaths.host', '=', 'kills.host')
        .onRef('deaths.game_mode', '=', 'kills.game_mode')
        .onRef('deaths.map', '=', 'kills.map')
    )
    .leftJoin('deathswithweapon', (join) =>
      join
        .onRef('deathswithweapon.victim_id', '=', 'kills.attacker_id')
        .onRef('deathswithweapon.victim_current_weapon', '=', 'kills.cause_of_death')
        .onRef('deathswithweapon.servername', '=', 'kills.servername')
        .onRef('deathswithweapon.host', '=', 'kills.host')
        .onRef('deathswithweapon.game_mode', '=', 'kills.game_mode')
        .onRef('deathswithweapon.map', '=', 'kills.map')
    )
    // .selectAll('kills')
    .select([
      sql<string>`COALESCE(kills.attacker_name, deaths.victim_name)`.as('attacker_name'),
      sql<string>`COALESCE(kills.attacker_id, deaths.victim_id)`.as('attacker_id'),
      sql<number>`COALESCE(kills.kills, 0)`.as('kills'),
      sql<number>`COALESCE(kills.total_distance, 0)`.as('total_distance'),
      sql<number>`COALESCE(deathswithweapon.deaths, 0)`.as('deaths_with_weapon'),
      sql<number>`COALESCE(kills.max_distance, 0)`.as('max_distance'),
      sql<number>`COALESCE(deaths.deaths, 0)`.as('deaths'),
      sql<string>`COALESCE(kills.servername, deaths.servername)`.as('servername'),
      sql<number>`COALESCE(kills.host, deaths.host)`.as('host'),
      sql<string>`COALESCE(kills.cause_of_death, deaths.cause_of_death)`.as('cause_of_death'),
      sql<string>`COALESCE(kills.map, deaths.map)`.as('map'),
      sql<string>`COALESCE(kills.game_mode, deaths.game_mode)`.as('game_mode')
    ])
    .execute()
}
export default processAll
