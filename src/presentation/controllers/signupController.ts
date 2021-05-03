import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/Controller'
import { EmailValidator } from '../protocols/EmailValidator'
import { InvalidParamError } from '../error/invalid-param-error'
import { ServerError } from '../error/server-error'

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const { body } = httpRequest
      const { email } = body

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (let index = 0; index < requiredFields.length; index++) {
        const field = requiredFields[index]
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      return {
        statusCode: 200,
        body: {},
      }
    } catch (error) {
      return { statusCode: 500, body: new ServerError() }
    }
  }
}
