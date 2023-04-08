/**
 * This file contains all functions related to population of the REDIS database for weapons.
 */
import cache from '../../cache/redis'
import { getWeaponReport } from '../../cache/cacheUtils'

/**
 * Combines weapons reports in a readable json string.
 *
 * ProcessWeaponReports must be called manually before this function !
 *
 * Inputs `SET` `[servers:{serverId}:][players:{playerId}:]weapons`
 *
 * Outputs `STRING` `[servers:{serverId}:][players:{playerId}:]weapons:processedList`
 * @param server optional server filter
 * @param player optional player filter
 * @returns
 */
export async function createWeaponJson(server?: number, player?: string) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons`
  const weapons = await cache.SMEMBERS(cacheLocation)
  const promises: Promise<any>[] = []
  const data: {
    [weaponId: string]: {
      [weaponData: string]: string
    }
  } = {}
  weapons.forEach((wpn) => {
    promises.push(
      (async () => {
        const weaponData = await getWeaponReport(wpn, server, player)
        if (Object.keys(weaponData).length > 0) {
          data[wpn] = weaponData
        }
      })()
    )
  })
  await Promise.all(promises)
  return await cache.SET(cacheLocation + `:processedList`, JSON.stringify(data))
}
