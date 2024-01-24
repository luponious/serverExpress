import { Router } from 'express'
import { User } from '../../user.js'
import { deleteTokenFromCookie, tokenizeUserInCookie } from '../../middlewares/tokens.js'

export const sessionsRouter = Router()

sessionsRouter.post('/',
  async (req, res, next) => {
    try {
      const user = await User.autenticar(req.body)
      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  },
  tokenizeUserInCookie,
  (req, res) => {
    res.sendStatus(201)
  }
)

sessionsRouter.delete('/current',
  deleteTokenFromCookie,
  (req, res) => {
    res.sendStatus(204)
  }
)