import http from 'http'
import https from 'https'

export async function GetRequest(url: string) {
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
      resp.on('error', (err) => {
        reject(err)
      })
    }

    if (url.startsWith('https')) {
      https.get(url, handler)
    } else {
      http.get(url, handler)
    }
  })
}
