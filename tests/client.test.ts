import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import clientMain from '../src/clientMain'
import * as dotenv from 'dotenv'
dotenv.config()

let listenServer

beforeAll(async () => {
    listenServer = await clientMain;
})

describe('client', () => {
    test('server list', async () => {
        const request = await fetch("http://127.0.0.1:3000/servers")
        const data = await request.json()
        expect(data.length).toBeGreaterThan(0)
        expect(data[0]).toHaveProperty('name')
        expect(data[0]).toHaveProperty('id')
        expect(data[0]).toHaveProperty('description')
    })

    test('player list', async () => {
        const request = await fetch("http://127.0.0.1:3000/players")
        const data = await request.json()
        const first = Object.entries(data)[0]
        expect(first[1]).toHaveProperty('max_distance')
        expect(first[1]).toHaveProperty('total_distance')
        expect(first[1]).toHaveProperty('kills')
    })

    test('weapon list', async () => {
        const request = await fetch("http://127.0.0.1:3000/weapons")
        const data = await request.json()
        const first = Object.entries(data)[0]
        expect(first[1]).toHaveProperty('max_distance')
        expect(first[1]).toHaveProperty('total_distance')
        expect(first[1]).toHaveProperty('kills')
    })
})

afterAll((done) => {
    listenServer.close(() => {
        done()
    })
})