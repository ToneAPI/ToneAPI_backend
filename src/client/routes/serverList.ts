import { RequestHandler } from 'express'
import { param } from 'express-validator'
import { validateErrors } from '../../common'
import db from '../../db/db'

const middlewares: RequestHandler[] = [
  async (req, res) => {
    const data = await db.selectFrom('server').selectAll().execute()
    res.status(200).send(
      data.map((e) => {
        return { name: e.name, id: e.id, description: e.description }
      })
    )
  }
]

export default middlewares
