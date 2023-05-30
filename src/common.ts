import { type RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import http from 'http'
import https from 'https'

export async function GetRequest (url: string) {
  return await new Promise<string>((resolve, reject) => {
    const handler = (resp: http.IncomingMessage) => {
      let data = ''

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data)
      })
    }
    let req
    if (url.startsWith('https')) {
      req = https.get(url, handler)
    } else {
      req = http.get(url, handler)
    }
    req
      .on('error', (err) => {
        reject(err)
      })
      .end()
  })
}

export const validateErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.error(JSON.stringify(errors), 'body', req.body, 'query', req.params)
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
