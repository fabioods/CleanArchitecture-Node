import { Router } from 'express'
import { makeSignUpController } from '../factories/signup'
import { adapRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', adapRoute(makeSignUpController()))
}
