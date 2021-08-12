import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import SignUpController from '../../presentation/controllers/signUp/signupController'

import { EmailValidatorAdapter } from '../../utils/email-validator'

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const encrypter = new BcryptAdapter(12)
  const addAccountRepository = new AccountMongoRepository()
  const addAccountUseCase = new DbAddAccount(encrypter, addAccountRepository)
  return new SignUpController(emailValidatorAdapter, addAccountUseCase)
}
