import http from 'http'
import https from 'https'

export function GetRequest(url: string) {
  return new Promise<string>((resolve, reject) => {
    let handler = (resp: http.IncomingMessage) => {
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
