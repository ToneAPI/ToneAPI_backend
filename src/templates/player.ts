/* eslint-disable @typescript-eslint/naming-convention */
import { Router, type Response } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../common'
import { validateBody, type RequestBody } from '../types'
import typia from 'typia'
import { checkUpdateOrCreatePlayer } from '../utils'

const router = Router()

interface PlayerConnect {
  username: string
  match_id: number
}

router.post(
  '/:playerId/connect',
  param('playerId').exists().withMessage('Missing Player ID').bail().isNumeric().withMessage('Player ID is not numeric'),
  validateErrors,
  validateBody(typia.createValidate<PlayerConnect>()),
  (req: RequestBody<PlayerConnect>, res: Response) => {
    void (async () => {
      console.log('player connected')
      const { username } = req.body
      await checkUpdateOrCreatePlayer({
        id: req.params.playerId,
        name: username
      })
      res.status(200).send()
    })()
  }
)

export default router
