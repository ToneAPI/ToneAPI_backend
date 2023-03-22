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
  player?: string
) {
  const serverPrefix = server?.toString() ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons:` + weapon
  const data = await cache.HGETALL(cacheLocation)
  delete data.last_entry
  return data
}

export function getWeaponSet(server?: number, player?: string) {
  const serverPrefix = server?.toString() ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  const cacheLocation = serverPrefix + playerPrefix + `weapons`
  return cache.SMEMBERS(cacheLocation)
}

/**
 * Show the processed list of weapons
 * @param server
 * @param player
 * @returns string
 */
export async function getWeaponList(server?: string, player?: string) {
  const serverPrefix = server?.toString() ? `servers:${server}:` : ''
  const playerPrefix = player ? `players:${player}:` : ''
  return JSON.parse(
    (await cache.GET(serverPrefix + playerPrefix + `weapons:processedList`)) ||
      '{}'
  )
}

/**
 * Show processed data for a player
 * @param player
 * @param server
 * @param weapon
 * @returns
 */
export async function getPlayerReport(
  player: string,
  server?: number,
  weapon?: string
) {
  const serverPrefix = server?.toString() ? `servers:${server}:` : ''
  const weaponPrefix = weapon ? `weapons:${weapon}:` : ''
  const cacheLocation = serverPrefix + weaponPrefix + `players:` + player
  const data = await cache.HGETALL(cacheLocation)
  delete data.last_entry
  return data
}

/**
 * Shows processed list of players
 * @param server
 * @param weapon
 * @returns string
 */
export async function getPlayerList(server?: number, weapon?: string) {
  const serverPrefix = server?.toString() ? `servers:${server}:` : ''
  const weaponPrefix = weapon ? `weapons:${weapon}:` : ''
  return JSON.parse(
    (await cache.GET(serverPrefix + weaponPrefix + `players:processedList`)) ||
      '{}'
  )
}

export function getPlayerSet(server?: number, weapon?: string) {
  const serverPrefix = server?.toString() ? `servers:${server}:` : ''
  const weaponPrefix = weapon ? `weapons:${weapon}:` : ''
  const cacheLocation = serverPrefix + weaponPrefix + `players`
  return cache.SMEMBERS(cacheLocation)
}
