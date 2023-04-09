import db from '../db/db'
const { count, max, sum } = db.fn
import client from '../cache/redis'

export const genPrefix = {
  global: ({ server }: { server?: number }) => {
    return (server ? `servers.${server}.` : '') + 'data'
  },
  weapon: ({ cause_of_death, server }: { cause_of_death: string, server?: number }) => {
    return (server ? `servers.${server}.` : '') + `weapons.${cause_of_death}`
  },
  player: ({ attacker_id, server }: { attacker_id: string, server?: number }) => {
    return (server ? `servers.${server}.` : '') + `players.${attacker_id}`
  },
  playerWeapons: ({ cause_of_death, attacker_id, server }: { attacker_id: string, cause_of_death: string, server?: number }) => {
    return (server ? `servers.${server}.` : '') + `players.${attacker_id}.weapons.${cause_of_death}`
  },
  weaponPlayers: ({ cause_of_death, attacker_id, server }: { attacker_id: string, cause_of_death: string, server?: number }) => {
    return (server ? `servers.${server}.` : '') + `weapons.${cause_of_death}.players.${attacker_id}`
  },
}

/**
 * Starts the process of populating the REDIS database globally
 * @returns
 */
async function processAll() {
  console.log('Starting data calculation...')
  const timeStart = new Date()

  if (!await client.json.type('kills')) await client.json.set('kills', '$', { data: {}, weapons: {}, players: {}, servers: {} })
  await Promise.all([processGlobalStats(), processServerStats()])
  console.log(
    'Data calculation finished. Took + ' +
    Math.abs(new Date().getTime() - timeStart.getTime()) / 1000 +
    ' seconds'
  )
  if (process.env.ENVIRONMENT == 'production') {
    return
  }
  setTimeout(processAll, 3600000)
}

async function processGlobalStats() {
  let promises: Promise<any>[] = []
  //Global kills
  await db.selectFrom('kill').select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance')]).execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, max_distance, total_distance }) => {
        await processData(genPrefix.global({}), { total_distance, max_distance, kills }, transaction)
      }))
      return transaction.exec()
    })

  //Global weapon kill
  await db.selectFrom('kill').select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'cause_of_death']).groupBy('cause_of_death').execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, max_distance, total_distance, cause_of_death }) => {
        const prefix = genPrefix.weapon({ cause_of_death })
        if (!await client.json.type('kills', prefix)) await client.json.set('kills', prefix, { players: {} })
        await processData(prefix, { kills, max_distance, total_distance }, transaction)
      }))
      return transaction.exec()
    })

  //Global player kill
  await db.selectFrom('kill').select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'attacker_id']).groupBy('attacker_id').whereRef("attacker_id", '!=', 'victim_id').execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, max_distance, total_distance, attacker_id }) => {
        const prefix = genPrefix.player({ attacker_id })
        if (!await client.json.type('kills', prefix)) await client.json.set('kills', prefix, { weapons: {} })
        await processData(prefix, { kills, max_distance, total_distance }, transaction)
      }))
      return transaction.exec()
    })
  //Global player deaths
  await db.selectFrom('kill').select([count('id').as('kills'), 'victim_id']).groupBy('victim_id').execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, victim_id }) => {
        const prefix = genPrefix.player({ attacker_id: victim_id })
        transaction.json.set('kills', prefix + ".deaths", Number(kills))
      }))
      return transaction.exec()
    })

  //Player weapon kills
  await db.selectFrom('kill').select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'attacker_id', 'cause_of_death']).groupBy(['attacker_id', 'cause_of_death']).whereRef("attacker_id", '!=', 'victim_id').execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, max_distance, total_distance, attacker_id, cause_of_death }) => {
        await processData(genPrefix.playerWeapons({ attacker_id, cause_of_death }), { kills, max_distance, total_distance }, transaction)
        await processData(genPrefix.weaponPlayers({ attacker_id, cause_of_death }), { kills, max_distance, total_distance }, transaction)
      }))
      return transaction.exec()
    })
  //player weapon deaths
  await db.selectFrom('kill').select([count('id').as('kills'), 'victim_id', 'cause_of_death']).groupBy(['victim_id', 'cause_of_death']).execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, victim_id, cause_of_death }) => {
        transaction.json.set('kills', genPrefix.weaponPlayers({ attacker_id: victim_id, cause_of_death }) + ".deaths", Number(kills))
      }))
      return transaction.exec()
    })
}

async function processServerStats() {
  let promises: Promise<any>[] = []
  //Server global kills
  await db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'server'])
    .groupBy(['server']).execute().then(async (data) => {
      let transaction = client.multi()
      const p = data.map(async ({ kills, max_distance, total_distance, server }) => {
        if (!await client.json.type('kills', `servers.${server}`)) await client.json.set('kills', `servers.${server}`, { data: {}, weapons: {}, players: {} })
        await processData(genPrefix.global({ server }), { total_distance, max_distance, kills }, transaction)
      })
      await Promise.all(p)
      return transaction.exec()
    })

  //Server weapon kills
  await db.selectFrom('kill')
    .select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'cause_of_death', 'server']).groupBy(['cause_of_death', 'server']).execute().then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, max_distance, total_distance, cause_of_death, server }) => {
        const prefix = genPrefix.weapon({ cause_of_death, server })
        if (!await client.json.type('kills', prefix)) await client.json.set('kills', prefix, { players: {} })
        await processData(prefix, { kills, max_distance, total_distance }, transaction)
      }))
      return transaction.exec()
    })
  //server player kill
  await db.selectFrom('kill').select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'attacker_id', 'server']).groupBy(['attacker_id', 'server']).whereRef("attacker_id", '!=', 'victim_id').execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, max_distance, total_distance, attacker_id, server }) => {
        const prefix = genPrefix.player({ attacker_id, server })
        if (!await client.json.type('kills', prefix)) await client.json.set('kills', prefix, { weapons: {} })
        await processData(prefix, { kills, max_distance, total_distance }, transaction)
      }))
      return transaction.exec()
    })
  //server player deaths
  await db.selectFrom('kill').select([count('id').as('kills'), 'victim_id', 'server']).groupBy(['victim_id', 'server']).execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, victim_id, server }) => {
        const prefix = genPrefix.player({ attacker_id: victim_id, server })
        transaction.json.set('kills', prefix + ".deaths", Number(kills))
      }))
      return transaction.exec()
    })

  //player weapon kills
  await db.selectFrom('kill').select([count('id').as('kills'), max('distance').as('max_distance'), sum('distance').as('total_distance'), 'attacker_id', 'cause_of_death', 'server']).groupBy(['attacker_id', 'cause_of_death', 'server']).whereRef("attacker_id", '!=', 'victim_id').execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, max_distance, total_distance, attacker_id, cause_of_death, server }) => {
        await processData(genPrefix.playerWeapons({ attacker_id, cause_of_death, server }), { kills, max_distance, total_distance }, transaction)
        await processData(genPrefix.weaponPlayers({ attacker_id, cause_of_death, server }), { kills, max_distance, total_distance }, transaction)
      }))
      return transaction.exec()
    })
  //player weapon deaths
  await db.selectFrom('kill').select([count('id').as('kills'), 'victim_id', 'cause_of_death', 'server']).groupBy(['victim_id', 'cause_of_death', 'server']).execute()
    .then(async (data) => {
      let transaction = client.multi()
      await Promise.all(data.map(async ({ kills, victim_id, cause_of_death, server }) => {
        transaction.json.set('kills', genPrefix.weaponPlayers({ attacker_id: victim_id, cause_of_death, server }) + ".deaths", Number(kills))
      }))
      return transaction.exec()
    })
}

async function processData(prefix: string, { total_distance, max_distance, kills }: { total_distance: string | number | bigint, max_distance: number, kills: string | number | bigint }, transaction: ReturnType<typeof client.multi>) {
  if (!await client.json.type('kills', prefix)) await client.json.set('kills', prefix, {})
  transaction = transaction.json.set('kills', prefix + ".total_distance", Number(total_distance))
  transaction = transaction.json.set('kills', prefix + ".max_distance", Number(max_distance))
  transaction = transaction.json.set('kills', prefix + ".kills", Number(kills))
  return
}

export default processAll
