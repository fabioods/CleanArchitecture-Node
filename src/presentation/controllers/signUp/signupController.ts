import { MissingParamError, InvalidParamError } from '../../error'
import { badRequest, serverError, ok } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from './signUpProtocols'

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const { email, password, passwordConfirmation, name } = body

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (let index = 0; index < requiredFields.length; index++) {
        const field = requiredFields[index]
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        email,
        name,
        password,
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
