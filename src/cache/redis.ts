import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD
})

client.on('error', (err) => console.log('Redis Client Error', err))

export function cacheReady() {
  return client.connect()
}
export default client

//await client.set('key', 'value');
//const value = await client.get('key');
//await client.disconnect();
