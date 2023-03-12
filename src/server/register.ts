import { Router } from 'express'
import { GetRequest } from '../common'
import { FindServer, CreateServer } from '../db/db'
import { body, validationResult } from 'express-validator'

const verificationString = 'I am a northstar server!'
const masterServerURL = 'https://northstar.tf'

const router = Router()

const hostsCount: { [id: string]: number } = {}
const hostsTimeout: { [id: string]: NodeJS.Timeout } = {}

//Very simple rate limiting. max 2 registers per IP every 5 mins. Maybe 2 is a bit few ?
router.post('/register', (req, res, next) => {
  let ip =
    req.header('x-forwarded-for') || req.socket.remoteAddress || 'undefined'
  if (hostsCount[ip] > 2) {
    return res.status(429).json({
      error:
        'too many requests. Please wait 5 minutes before requesting a register again.'
    })
  }
  clearTimeout(hostsTimeout[ip])
  hostsCount[ip] = hostsCount[ip] ?? (hostsCount[ip] + 1) | 1
  hostsTimeout[ip] = setTimeout(() => {
    hostsCount[ip] = 0
  }, 300000)

  next()
})

router.post(
  '/register',
  body(['name', 'description']).isString().withMessage('must be strings'),
  body('auth_port')
    .toInt()
    .isInt({ min: 1, max: 65535 })
    .withMessage('must be between 1 and 65535'),
  async (req, res, next) => {
    const errors = validationResult(req)
    console.log(req.body)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      //Check if server name isn't already in database
      if (!!(await FindServer({ name: req.body.name }))) {
        return res
          .status(403)
          .json({ error: 'Server already exists in the database' })
      }

      //Check if server is in masterserver's list
      const masterServerList = JSON.parse(
        await GetRequest(masterServerURL + '/client/servers')
      ) as Array<any>
      if (!masterServerList.find((e) => e.name == req.body.name)) {
        return res
          .status(403)
          .json({ error: 'Server not listed in masterserver' })
      }

      //Send request to verify server. Not very useful for now, but maybe a future method for auth ?
      //Maybe should set a blacklist here for local domain ?
      const endpoint =
        'http://' +
        (req.header('x-forwarded-for') || req.socket.remoteAddress) +
        ':' +
        req.body.auth_port +
        '/verify'
      if ((await GetRequest(endpoint)) != verificationString) {
        return res.status(400).json({
          error: "Couldn't reach gameserver at " + endpoint
        })
      }

      //send token here
      res.status(201).json(
        await CreateServer({
          name: req.body.name,
          description: req.body.description
        })
      )
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        error: "Server encountered an error, Couldn't register gameserver."
      })
    }
  }
)

export default router
