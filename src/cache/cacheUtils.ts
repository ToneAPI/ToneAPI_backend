import cache from './redis'
/**
 * Shows the data for one weapon
 * @param weapon
 * @param server
 * @param player
 * @returns
 */
export async function getWeaponReport(
  weapon: string,
  server?: number,
  player?: number
) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons:` + weapon
  const data = await cache.HGETALL(cacheLocation)
  delete data.last_entry
  return data
}

export function getWeaponList(server?: string, player?: string) {
  const serverPrefix = server ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  return cache.GET(serverPrefix + playerPrefix + `weapons:processedList`)
}
