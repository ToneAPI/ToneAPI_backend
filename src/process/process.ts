import db from '../db/db'
import { sql } from 'kysely'
const { max, sum } = db.fn

export let allData: Awaited<ReturnType<typeof processGlobalStats>>

/**
 * populates allData
 * @returns
 */
async function processAll (): Promise<void> {
  console.log('Starting data calculation...')
  const timeStart = new Date()

  allData = await processGlobalStats()

  console.log(`Data calculation finished. Took + ${Math.abs(new Date().getTime() - timeStart.getTime()) / 1000} seconds`)
}

interface KillRecord {
  kills: number
  deaths: number
  deaths_while_equipped: number
  username?: string
  max_distance: number
  total_distance: number
}

async function processGlobalStats () {
  const data = await db.selectFrom('kill_view').select(['attacker_id', sql<string>`last(attacker_name)`.as('username'), sum('kills').as('kills'), sum('deaths').as('deaths'), sum('deaths_with_weapon').as('deaths_while_equipped'), sum('total_distance').as('total_distance'), max('max_distance').as('max_distance')]).groupBy('attacker_id').execute()
  return data.reduce<Record<string, KillRecord>>((acc, curr) => {
    acc[curr.attacker_id] = {
      kills: Number(curr.kills),
      deaths: Number(curr.deaths),
      max_distance: Number(curr.max_distance),
      total_distance: Number(curr.total_distance),
      deaths_while_equipped: Number(curr.deaths_while_equipped),
      username: curr.username
    }
    return acc
  }, {})
}
export default processAll
