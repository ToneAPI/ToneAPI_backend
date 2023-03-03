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
router.post('/servers/register', (req, res, next) => {
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
  '/servers/register',
  body(['name', 'description']).isString(),
  body('auth_endpoint').isURL(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(JSON.stringify(errors))
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
      if ((await GetRequest(req.body.auth_endpoint)) != verificationString) {
        return res.status(400).json({
          error: "Couldn't reach gameserver at " + req.body.auth_endpoint
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
