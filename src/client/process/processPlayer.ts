/**
 * This file contains all functions related to population of the REDIS database for players.
 */
import cache from '../../cache/redis'
import { getPlayerReport, getPlayerSet } from '../../cache/cacheUtils'

/**
 * Combines player reports in a readable json string.
 *
 * ProcessPlayerReport must be called manually before this function !
 *
 * Inputs `SET` `[servers:{serverId}:][weapons:{weaponId}:]players`
 *
 * Outputs `STRING` `[servers:{serverId}:][weapons:{weaponId}:]players:processedList`
 * @param server optional server filter
 * @param weapon optional player filter
 * @returns
 */
export async function createPlayerJson(server?: number, weapon?: string) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const weaponPrefix = weapon ? `weapons:${weapon}:` : ''
  const cacheLocation = serverPrefix + weaponPrefix + `players`
  const players = await getPlayerSet(server, weapon)
  const promises: Promise<any>[] = []
  const data: {
    [playerId: string]: {
      [playerData: string]: string
    }
  } = {}
  players.forEach((plr) => {
    promises.push(
      (async () => {
        const playerData = await getPlayerReport(plr, server, weapon)
        if (Object.keys(playerData).length > 0) {
          data[plr] = playerData
        }
      })()
    )
  })
  await Promise.all(promises)
  return await cache.SET(cacheLocation + `:processedList`, JSON.stringify(data))
}
