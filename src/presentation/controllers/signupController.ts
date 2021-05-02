import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/Controller'

export default class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (let index = 0; index < requiredFields.length; index++) {
      const field = requiredFields[index]
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 200,
      body: {},
    }
  }
}
