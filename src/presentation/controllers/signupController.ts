import { MissingParamError, InvalidParamError } from '../error'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

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
      return serverError()
    }
  }
}
